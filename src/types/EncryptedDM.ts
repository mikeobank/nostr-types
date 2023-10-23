import { secp256k1 } from "@noble/curves/secp256k1"
import { randomBytes } from "@noble/hashes/utils"

import { Base64, isBase64, base64ToBytes, bytesToBase64 } from "./Base64.js"
import { Hex, createHexFromUint8Array, createUint8ArrayFromHex } from "./Hex.js"
import { NostrEvent, createEvent, isEvent, isEventSync } from "./NostrEvent.js"
import type { PrivateKey, PublicKey } from "./KeyPair.js"
import { appendTag } from "./Tag.js"
import { encode, decode } from "../lib/utf8encoder.js"
import subtleCrypto from "../lib/subtleCrypto.js"

type EncryptedText = Base64
type IV = Base64
type EncryptedContent = `${ EncryptedText }?iv=${ IV }`
type EncryptedDM = Omit<NostrEvent, "kind" | "content"> & {
  kind: 4,
  content: EncryptedContent
}

// cryptographic settings / utils
const name = "AES-CBC"
const format = "raw"
const nonSchnorrPublicKey = (publicKey: PublicKey) : Hex => `02${ createHexFromUint8Array(publicKey) }`
const normalizeKey = (secret: Uint8Array) : Uint8Array => secret.slice(1, 33)

const separator = "?iv="
const createEncryptedContent = (text: EncryptedText, iv: IV) : EncryptedContent => `${ text }${ separator }${ iv }`
const parseEncryptedContent = (encryptedMessage: EncryptedText) : [EncryptedText, IV] => {
  const parts = encryptedMessage.split(separator)
  if (parts.length === 2 && parts.every(isBase64)) {
    return parts as [EncryptedText, IV]
  } else {
    throw new Error ("Invalid EncryptedContent")
  }
}

export const encrypt = (privateKey: PrivateKey) => async (publicKey: PublicKey, text: string) : Promise<EncryptedContent> => {
  const sharedSecret = secp256k1.getSharedSecret(privateKey, nonSchnorrPublicKey(publicKey))
  const key = normalizeKey(sharedSecret)
  const iv = randomBytes(16)
  const plainText = encode(text)
  const cryptoKey = await subtleCrypto.importKey(
    format,
    key,
    { name },
    false,
    ["encrypt"]
  )
  const cipherText = await subtleCrypto.encrypt(
    { name, iv },
    cryptoKey,
    plainText
  )
  const cipherTextBase64 = bytesToBase64(new Uint8Array(cipherText))
  const ivBase64 = bytesToBase64(iv)
  return createEncryptedContent(cipherTextBase64, ivBase64)
}

export const decrypt = (privateKey: PrivateKey) => async (publicKey: PublicKey, encryptedMessage: EncryptedContent) : Promise<string> => {
  const [cipherTextBase64, ivBase64] = parseEncryptedContent(encryptedMessage)
  const sharedSecret = secp256k1.getSharedSecret(privateKey, nonSchnorrPublicKey(publicKey))
  const key = normalizeKey(sharedSecret)
  const cryptoKey = await subtleCrypto.importKey(
    format,
    key,
    { name },
    false,
    ["decrypt"]
  )
  const cipherText = base64ToBytes(cipherTextBase64)
  const iv = base64ToBytes(ivBase64)
  const plainText = await subtleCrypto.decrypt(
    { name, iv },
    cryptoKey,
    cipherText
  )
  return decode(new Uint8Array(plainText))
}

export const encryptEvent = (privateKey: PrivateKey) => async (publicKey: PublicKey, event: NostrEvent) : Promise<EncryptedDM> => {
  const encryptedContent = await encrypt(privateKey)(publicKey, event.content)
  const tags = appendTag(event.tags, ["p", createHexFromUint8Array(publicKey)])
  return await createEvent(privateKey)(4, tags, encryptedContent, event.created_at) as EncryptedDM
}

export const decryptEvent = (privateKey: PrivateKey) => async (encryptedDM: EncryptedDM) : Promise<NostrEvent> => {
  const { id, kind, tags, created_at, pubkey, sig } = encryptedDM
  const decryptedContent = await decrypt(privateKey)(createUint8ArrayFromHex(pubkey), encryptedDM.content)
  return {
    id,
    kind,
    tags,
    created_at,
    pubkey,
    content: decryptedContent,
    sig
  }
}

export const isEncryptedDM = async (encryptedDM: unknown) : Promise<boolean> => {
  if (await isEvent(encryptedDM) && (encryptedDM as NostrEvent).kind === 4) {
    try {
      parseEncryptedContent((encryptedDM as NostrEvent).content)
      return true
    } catch (err) {
      return false
    }
  }
  return false
}

export const isEncryptedDMSync = (encryptedDM: unknown) : encryptedDM is EncryptedDM => {
  if (isEventSync(encryptedDM) && encryptedDM.kind === 4) {
    try {
      parseEncryptedContent((encryptedDM as NostrEvent).content)
      return true
    } catch (err) {
      return false
    }
  }
  return false
}