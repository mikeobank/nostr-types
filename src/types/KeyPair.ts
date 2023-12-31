import { schnorr } from "@noble/curves/secp256k1"
import { type PrivateKey, generatePrivateKey, PrivateKeyHex, isPrivateKeyHex, createPrivateKeyFromHex } from "./PrivateKey.js"
import { type PublicKey } from "./PublicKey.js"

export type KeyPair = {
  privateKey: PrivateKey
  publicKey: PublicKey
}

export const createKeyPair = (privateKeyOrHex: PrivateKey | PrivateKeyHex) : KeyPair => {
  const privateKey = isPrivateKeyHex(privateKeyOrHex) ? createPrivateKeyFromHex(privateKeyOrHex) : privateKeyOrHex
  const publicKey = schnorr.getPublicKey(privateKey)
  return {
    privateKey,
    publicKey
  }
}

export const generateKeyPair = () : KeyPair => {
  const privateKey = generatePrivateKey()
  return createKeyPair(privateKey)
}