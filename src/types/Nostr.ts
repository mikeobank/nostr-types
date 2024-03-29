import { type PrivateKey } from "./PrivateKey.js"
import { type PublicKey, PublicKeyHex, createPublicKeyHex } from "./PublicKey.js"
import { createKeyPair } from "./KeyPair.js"
import { type RelayURL } from "./RelayURL.js"
import { type NostrEvent, type UnsignedNostrEvent, createEvent } from "./NostrEvent.js"
import { encrypt, decrypt, type EncryptedContent } from "./EncryptedDM.js"
import { type Content } from "./Content.js"

type Relays = Record<RelayURL, { read: boolean, write: boolean }>

export const createNostr = (crypto: SubtleCrypto) => (privateKey: PrivateKey, relays?: Relays) => {

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
    encrypt: async (publicKey: PublicKey, plaintext: Content) : Promise<EncryptedContent> => {
      return await encrypt(crypto)(privateKey)(publicKey, plaintext)
    },
    decrypt: async (publicKey: PublicKey, ciphertext: EncryptedContent) : Promise<Content> => {
      return await decrypt(crypto)(privateKey)(publicKey, ciphertext)
    }
  }

  return {
    getPublicKey,
    signEvent,
    getRelays,
    nip04
  }
}

export const setNostrOnWindow = (crypto: SubtleCrypto) => (privateKey: PrivateKey, relays?: Relays) => {
  if (typeof window === "undefined") return console.warn("`window` is not defined. Probably not running in browser environment")
  if ("nostr" in window) console.warn("window.nostr is already existing and will be overridden")
  ;(window as unknown as Record<"nostr", unknown>).nostr = createNostr(crypto)(privateKey, relays)
}