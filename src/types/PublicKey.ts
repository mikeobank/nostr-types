import type { PublicKey } from "./KeyPair"

import { createHexFromUint8Array, isHex, isHex32Bytes } from "./Hex"
import isString from "../lib/utils/isString"
import { isNotEmpty } from "../lib/utils/isEmpty"

export type PublicKeyHex = string
export type PublicKeyHexPrefix = string

export const createPublicKeyHex = (publicKey: PublicKey) => createHexFromUint8Array(publicKey)

export const isPublicKeyHex = (publicKeyHex: unknown) : publicKeyHex is PublicKeyHex => {
  return isString(publicKeyHex) && isHex32Bytes(publicKeyHex)
}

export const arePublicKeyHexes = (publicKeysHex: unknown[]) : publicKeysHex is PublicKeyHex[] => {
  return publicKeysHex.every(isPublicKeyHex)
}

export const isPublicKeyHexPrefix = (publicKeyHexPrefix: unknown) : publicKeyHexPrefix is PublicKeyHexPrefix => {
  return isString(publicKeyHexPrefix) && isNotEmpty(publicKeyHexPrefix) && isHex(publicKeyHexPrefix)
}

export const arePublicKeyHexPrefixes = (publicKeyHexPrefixes: unknown[]) : publicKeyHexPrefixes is PublicKeyHexPrefix[] => {
  return publicKeyHexPrefixes.every(isPublicKeyHexPrefix)
}