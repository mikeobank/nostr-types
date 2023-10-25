import { PrivateKey, createKeyPair } from "./KeyPair.js"
import { RelayURL } from "./RelayURL.js"
import { PublicKeyHex, createPublicKeyHex } from "./PublicKey.js"
import { NostrEvent, UnsignedNostrEvent, createEvent } from "./NostrEvent.js"
import { encrypt, decrypt } from "./EncryptedDM.js"
import isBrowser from "../lib/utils/isBrowser.js"

type Relays = Record<RelayURL, { read: boolean, write: boolean }>

export const createNostr = (privateKey: PrivateKey, relays?: Relays) => {

  const getPublicKey = () : PublicKeyHex => {
    const { publicKey } = createKeyPair(privateKey)
    return createPublicKeyHex(publicKey)
  }

  const signEvent = async (event: UnsignedNostrEvent) : Promise<NostrEvent> => {
    const { kind, tags, content, created_at } = event
    return await createEvent(privateKey)(kind, tags, content, created_at)
  }

  const getRelays = () : Relays => {
    return relays ?? {}
  }

  const nip04 = {
    encrypt: encrypt(privateKey),
    decrypt: decrypt(privateKey)
  }

  return {
    getPublicKey,
    signEvent,
    getRelays,
    nip04
  }
}

export const setNostrOnWindow = (privateKey: PrivateKey, relays?: Relays) => {
  if (isBrowser === false) return console.warn("Not running in browser environment")
  if ("nostr" in window) console.warn("window.nostr is already existing and will be overridden")
  ;(window as unknown as Record<"nostr", unknown>).nostr = createNostr(privateKey, relays)
}