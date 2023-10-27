import { schnorr } from "@noble/curves/secp256k1"
import { Hex32Bytes, createHexFromUint8Array, createUint8ArrayFromHex, isHex32Bytes } from "./Hex.js"
import isString from "../lib/utils/isString.js"

export type PrivateKey = Uint8Array
export type PrivateKeyHex = Hex32Bytes

export const isPrivateKeyHex = (privateKeyHex: unknown) : privateKeyHex is PrivateKeyHex => {
  return isString(privateKeyHex) && isHex32Bytes(privateKeyHex)
}

export const createPrivateKeyHex = (privateKey: PrivateKey) : PrivateKeyHex => {
  return createHexFromUint8Array(privateKey)
}

export const createPrivateKeyFromHex = (privateKeyHex: PrivateKeyHex) : PrivateKey => {
  return createUint8ArrayFromHex(privateKeyHex)
}

export const generatePrivateKey = () : PrivateKey => {
  return schnorr.utils.randomPrivateKey()
}
