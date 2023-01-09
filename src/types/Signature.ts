import * as secp256k1 from "@noble/secp256k1"
import { sha256 } from "@noble/hashes/sha256"

// Required by `secp256k1.schnorr.signSync`
// LINK: https://github.com/paulmillr/noble-secp256k1#signmsghash-privatekey
secp256k1.utils.sha256Sync = (...msgs) => sha256(secp256k1.utils.concatBytes(...msgs))

import { createKeyPair, PrivateKey, PublicKey } from "./KeyPair"
import type { Id } from "./Id"
import { createHexFromUint8Array, createUint8ArrayFromHex, isHex64Bytes } from "./Hex"
import { PublicKeyHex } from "./PublicKey"
import isString from "../lib/utils/isString"

export type SignatureHex = string // 64 bytes hex encoded
type Signature = Uint8Array
type Message = string
type SignedMessage = { message: Message, publicKey: PublicKey, signature: Signature }

export const createSignature = (privateKey: PrivateKey) => async (id: Id) : Promise<SignatureHex> => {
  const signature = await secp256k1.schnorr.sign(id, privateKey)
  return createHexFromUint8Array(signature)
}

export const createSignatureSync = (privateKey: PrivateKey) => (id: Id) : SignatureHex => {
  const signature = secp256k1.schnorr.signSync(id, privateKey)
  return createHexFromUint8Array(signature)
}

export const isSignature = (signature: unknown) : signature is SignatureHex => {
  return isString(signature) && isHex64Bytes(signature)
}

export const verifySignature = async (publicKeyHex: PublicKeyHex, message: string, signature: SignatureHex) : Promise<boolean> => {
  const publicKey = createUint8ArrayFromHex(publicKeyHex)
  return await secp256k1.schnorr.verify(signature, message, publicKey)
}

export const verifySignatureSync = (publicKeyHex: PublicKeyHex, message: string, signature: SignatureHex) : boolean => {
  const publicKey = createUint8ArrayFromHex(publicKeyHex)
  return secp256k1.schnorr.verifySync(signature, message, publicKey)
}

export const sign = (privateKey: PrivateKey) => async (message: string) : Promise<SignedMessage> => {
  const { publicKey } = createKeyPair(privateKey)
  const signature = await secp256k1.schnorr.sign(message, privateKey)
  return {
    message,
    publicKey,
    signature
  }
}

export const signSync = (privateKey: PrivateKey) => (message: string) : SignedMessage => {
  const { publicKey } = createKeyPair(privateKey)
  const signature = secp256k1.schnorr.signSync(message, privateKey)
  return {
    message,
    publicKey,
    signature
  }
}

export const verify = async (publicKey: PublicKey, message: string, signature: Signature) : Promise<boolean> => {
  return await secp256k1.schnorr.verify(signature, message, publicKey)
}

export const verifySync = (publicKey: PublicKey, message: string, signature: Signature) : boolean => {
  return secp256k1.schnorr.verifySync(signature, message, publicKey)
}