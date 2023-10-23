import { schnorr } from "@noble/curves/secp256k1"

import { createKeyPair, PrivateKey, PublicKey } from "./KeyPair.js"
import type { Id } from "./Id.js"
import { createHexFromUint8Array, createUint8ArrayFromHex, isHex64Bytes } from "./Hex.js"
import { PublicKeyHex } from "./PublicKey.js"
import isString from "../lib/utils/isString.js"

export type SignatureHex = string // 64 bytes hex encoded
type Signature = Uint8Array
type Message = string
type SignedMessage = { message: Message, publicKey: PublicKey, signature: Signature }

export const createSignature = (privateKey: PrivateKey) => async (id: Id) : Promise<SignatureHex> => {
  const signature = schnorr.sign(id, privateKey)
  return createHexFromUint8Array(signature)
}

export const createSignatureSync = (privateKey: PrivateKey) => (id: Id) : SignatureHex => {
  const signature = schnorr.sign(id, privateKey)
  return createHexFromUint8Array(signature)
}

export const isSignature = (signature: unknown) : signature is SignatureHex => {
  return isString(signature) && isHex64Bytes(signature)
}

export const verifySignature = async (publicKeyHex: PublicKeyHex, message: string, signature: SignatureHex) : Promise<boolean> => {
  const publicKey = createUint8ArrayFromHex(publicKeyHex)
  return schnorr.verify(signature, message, publicKey)
}

export const verifySignatureSync = (publicKeyHex: PublicKeyHex, message: string, signature: SignatureHex) : boolean => {
  const publicKey = createUint8ArrayFromHex(publicKeyHex)
  return schnorr.verify(signature, message, publicKey)
}

export const sign = (privateKey: PrivateKey) => async (message: string) : Promise<SignedMessage> => {
  const { publicKey } = createKeyPair(privateKey)
  const signature = schnorr.sign(message, privateKey)
  return {
    message,
    publicKey,
    signature
  }
}

export const signSync = (privateKey: PrivateKey) => (message: string) : SignedMessage => {
  const { publicKey } = createKeyPair(privateKey)
  const signature = schnorr.sign(message, privateKey)
  return {
    message,
    publicKey,
    signature
  }
}

export const verify = async (publicKey: PublicKey, message: string, signature: Signature) : Promise<boolean> => {
  return schnorr.verify(signature, message, publicKey)
}

export const verifySync = (publicKey: PublicKey, message: string, signature: Signature) : boolean => {
  return schnorr.verify(signature, message, publicKey)
}