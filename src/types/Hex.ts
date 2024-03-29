import { bytesToHex, hexToBytes } from "@noble/hashes/utils"
import { is, isNot } from "../lib/utils/is.js"

export type Hex = string
export type Hex32Bytes = string
export type Hex64Bytes = string

const regex = /^[0-9a-f]*$/

export const isHex = (s: string) : s is Hex => regex.test(s)
export const isHexOfLength = (s: string, min: number, max?: number) : s is Hex => {
  if (is(max) && min >= max) throw new Error(`max: ${ max } is less than min: ${ min }`)
  if (isHex(s) === false) return false
  const l = s.length
  if (l < min) return false
  if (isNot(max) && l > min) return false
  if (is(max) && l > max) return false
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
  const s = bytesToHex(arr)
  return parseHex(s)
}

export const createUint8ArrayFromHex = (hex: Hex) : Uint8Array => {
  return hexToBytes(hex)
}
