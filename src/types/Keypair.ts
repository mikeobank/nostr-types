import { schnorr } from "@noble/curves/secp256k1"

export type PrivateKey = Uint8Array
export type PublicKey = Uint8Array
export type KeyPair = {
  privateKey: PrivateKey
  publicKey: PublicKey
}

export const createKeyPair = (privateKey: PrivateKey) : KeyPair => {
  const publicKey = schnorr.getPublicKey(privateKey)
  return {
    privateKey,
    publicKey
  }
}

export const generatePrivateKey = () : PrivateKey => {
  return schnorr.utils.randomPrivateKey()
}

export const generateKeyPair = () : KeyPair => {
  const privateKey = generatePrivateKey()
  return createKeyPair(privateKey)
}