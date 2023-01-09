import * as secp256k1 from "@noble/secp256k1"

export type Hex = string
export type Hex32Bytes = string
export type Hex64Bytes = string

const regex = /^[0-9a-f]*$/

export const isHex = (s: string) : s is Hex => regex.test(s)
export const isHexOfLength = (s: string, min: number, max?: number) : s is Hex => {
  if (max !== undefined && min >= max) throw new Error(`max: ${ max } is less than min: ${ min }`)
  if (isHex(s) === false) return false
  const l = s.length
  if (l < min) return false
  if (max === undefined && l > min) return false
  if (max !== undefined && l > max) return false
  return true
}
export const isHex32Bytes = (s: string) : s is Hex32Bytes => isHexOfLength(s, 32 * 2)
export const isHex64Bytes = (s: string) : s is Hex64Bytes => isHexOfLength(s, 64 * 2)

export const parseHex = (s: string) : Hex => {
  const lowerCased = s.toLowerCase()
  if (isHex(lowerCased) === false) throw new Error(`${ s } is not a HEX string`)
  return lowerCased
}

export const createHexFromUint8Array = (arr: Uint8Array) : Hex => {
  const s = secp256k1.utils.bytesToHex(arr)
  return parseHex(s)
}

export const createUint8ArrayFromHex = (hex: Hex) : Uint8Array => {
  return secp256k1.utils.hexToBytes(hex)
}
