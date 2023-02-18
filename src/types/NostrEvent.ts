import { Kind, KindOrName, isKind, getKind, isReplaceableKind, isEphemeralKind, isParameterizedReplaceableKind } from "./Kind"
import { Tags, areTags } from "./Tag"
import { Id, isId, createId } from "./Id"
import { PublicKeyHex, isPublicKeyHex, createPublicKeyHex } from "./PublicKey"
import { UnixTimestamp, isUnixTimestamp, now } from "./UnixTimestamp"
import { SignatureHex, isSignature, createSignature, createSignatureSync, verifySignature, verifySignatureSync } from "./Signature"
import { PublicKey, PrivateKey, createKeyPair } from "./KeyPair"
import { Content, isContent } from "./Content"
import toArray from "../lib/utils/toArray"
import isObject from "../lib/utils/isObject"
import { is } from "../lib/utils/is"

export type NostrEvent = {
  id: Id
  pubkey: PublicKeyHex
  created_at: UnixTimestamp
  kind: Kind
  tags: Tags
  content: Content
  sig: SignatureHex
}
export type UnsignedNostrEvent = Omit<NostrEvent, "sig">

const createUnsignedEvent = (kindOrName: KindOrName, tags: Tags, content: Content, created_at: UnixTimestamp, publicKey: PublicKey) : UnsignedNostrEvent => {
  const kind = getKind(kindOrName)
  const pubkey = createPublicKeyHex(publicKey)
  const id = createId(pubkey, created_at, kind, tags, content)
  return {
    id,
    pubkey,
    created_at,
    kind,
    tags,
    content
  }
}

export const createEvent = (privateKey: PrivateKey) => async (kindOrName: KindOrName, tags: Tags = [], content: Content = "", created_at: UnixTimestamp = now()) : Promise<NostrEvent> => {
  const { publicKey } = createKeyPair(privateKey)
  const unsignedEvent = createUnsignedEvent(kindOrName, tags, content, created_at, publicKey)
  const { id } = unsignedEvent
  const sig = await createSignature(privateKey)(id)
  return {
    ...unsignedEvent,
    sig
  }
}

export const createEventSync = (privateKey: PrivateKey) => (kindOrName: Kind | string, tags: Tags = [], content: Content = "", created_at: UnixTimestamp = now()) : NostrEvent => {
  const { publicKey } = createKeyPair(privateKey)
  const unsignedEvent = createUnsignedEvent(kindOrName, tags, content, created_at, publicKey)
  const { id } = unsignedEvent
  const sig = createSignatureSync(privateKey)(id)
  return {
    ...unsignedEvent,
    sig
  }
}

const verifyEventId = (event: UnsignedNostrEvent) => {
  const { id, pubkey, created_at, kind, tags, content } = event
  const verifiedId = createId(pubkey, created_at, kind, tags, content)
  return id === verifiedId
}

export const verifyEvent = async (event: NostrEvent) : Promise<boolean> => {
  if (verifyEventId(event) === false) return false
  const { id, pubkey, sig } = event
  return await verifySignature(pubkey, id, sig)
}

export const verifyEventSync = (event: NostrEvent) : boolean => {
  if (verifyEventId(event) === false) return false
  const { id, pubkey, sig } = event
  return verifySignatureSync(pubkey, id, sig)
}

const validateEvent = (event: unknown) : [UnsignedNostrEvent, SignatureHex] => {
  if (isObject(event)) {
    const { id, pubkey, created_at, kind, tags, content, sig } = event
    if (isId(id)) {
      if (isPublicKeyHex(pubkey)) {
        if (isUnixTimestamp(created_at)) {
          if (isKind(kind)) {
            if (areTags(tags)) {
              if (isContent(content)) {
                if (isSignature(sig)) {
                  if (verifyEventId({ id, pubkey, created_at, kind, tags, content })) {
                    return [{ id, pubkey, created_at, kind, tags, content }, sig]
                  }
                  throw new Error(`event.id (${ event.id } is not corresponding with event data`)
                }
                throw new Error(`event.sig (${ sig }) is inValid`)
              }
              throw new Error(`event.content (${ content }) is inValid`)
            }
            throw new Error(`event.tags (${ tags }) is inValid`)
          }
          throw new Error(`event.kind (${ kind }) is inValid`)
        }
        throw new Error(`event.created_at (${ created_at }) is inValid`)
      }
      throw new Error(`event.pubkey (${ pubkey }) is inValid`)
    }
    throw new Error(`event.id (${ id }) is inValid`)
  }
  throw new Error(`event (${ JSON.stringify(event) }) is not an object`)
}

export const parseEvent = async (event: unknown) : Promise<NostrEvent> => {
  const [unsignedEvent, sig] = validateEvent(event)
  const validEvent = { ...unsignedEvent, sig }
  if (await verifyEvent(validEvent)) {
    return validEvent
  } else {
    throw new Error(`could not verify event (event.id: ${ validEvent.id }, event.sig: ${ validEvent.sig })`)
  }
}

export const parseEventSync = (event: unknown) : NostrEvent => {
  const [unsignedEvent, sig] = validateEvent(event)
  const validEvent = { ...unsignedEvent, sig }
  if (verifyEventSync(validEvent)) {
    return validEvent
  } else {
    throw new Error(`could not verify event (event.id: ${ validEvent.id }, event.sig: ${ validEvent.sig })`)
  }
}

const tryParseEvent = async (event: unknown, shouldLogErrors: boolean) : Promise<NostrEvent | undefined> => {
  try {
    return await parseEvent(event)
  } catch (err) {
    if (shouldLogErrors) console.error(err)
    return undefined
  }
}

const tryParseEventSync = (event: unknown, shouldLogErrors: boolean) : NostrEvent | undefined => {
  try {
    return parseEventSync(event)
  } catch (err) {
    if (shouldLogErrors) console.error(err)
    return undefined
  }
}

export const parseEvents = async (events: unknown, shouldLogErrors = false) : Promise<NostrEvent[]> => {
  return (await Promise.all(
      toArray(events).map(async event => await tryParseEvent(event, shouldLogErrors))
    ))
    .filter(is)
}

export const parseEventsSync = (events: unknown, shouldLogErrors = false) : NostrEvent[] => {
  return toArray(events)
    .map(event => tryParseEventSync(event, shouldLogErrors))
    .filter(is)
}

export const isEvent = async (event: unknown) : Promise<boolean> => {
  return is(await tryParseEvent(event, false))
}

export const isEventSync = (event: unknown) : event is NostrEvent => {
  return is(tryParseEventSync(event, false))
}

export const isReplaceableEvent = (event: NostrEvent) : boolean => {
  return isReplaceableKind(event.kind)
}

export const isParameterizedReplaceableEvent = (event: NostrEvent) : boolean => {
  return isParameterizedReplaceableKind(event.kind)
}

export const isEphemeralEvent = (event: NostrEvent) : boolean => {
  return isEphemeralKind(event.kind)
}
