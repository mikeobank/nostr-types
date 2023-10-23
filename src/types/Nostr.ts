import { PrivateKey, createKeyPair } from "./KeyPair.js"
import { PublicKeyHex, createPublicKeyHex } from "./PublicKey.js"
import { NostrEvent, UnsignedNostrEvent, createEvent } from "./NostrEvent.js"
import { encrypt, decrypt } from "./EncryptedDM.js"
import isBrowser from "../lib/utils/isBrowser.js"

export const createNostr = (privateKey: PrivateKey) => {

  const getPublicKey = () : PublicKeyHex => {
    const { publicKey } = createKeyPair(privateKey)
    return createPublicKeyHex(publicKey)
  }

  const signEvent = async (event: UnsignedNostrEvent) : Promise<NostrEvent> => {
    const { kind, tags, content, created_at } = event
    return await createEvent(privateKey)(kind, tags, content, created_at)
  }

  const getRelays = () => {
    console.warn("`getRelays()` is not implemented")
    return {}
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

export const setNostrOnWindow = (privateKey: PrivateKey) => {
  if (isBrowser === false) return console.warn("Not running in browser environment")
  if ("nostr" in window) console.warn("window.nostr is already existing and will be overridden")
  ;(window as unknown as Record<"nostr", unknown>).nostr = createNostr(privateKey)
}