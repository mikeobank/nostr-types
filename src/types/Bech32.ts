import { bech32 as baseBech32 } from "@scure/base"

import { Hex, createHexFromUint8Array } from "./Hex.js"
import isString from "../lib/utils/isString.js"
import { bytesToHex, hexToBytes } from "@noble/hashes/utils"
import { isNot } from "../lib/utils/is.js"
import { decode as utf8Decode } from "../lib/utf8encoder.js"
import isIn from "../lib/utils/isIn.js"
import { PublicKey, PublicKeyHex, isPublicKeyHex } from "./PublicKey.js"
import { PrivateKey, PrivateKeyHex, isPrivateKeyHex } from "./PrivateKey.js"

type Bech32Char = string
type Bech32Chars = string
type Bech32Separator = "1"
type Bech32 = string
export type Npub = Bech32
export type Nsec = Bech32
export type Note = Bech32
const hexPrefixes = ["npub", "nsec", "note"]
type HexPrefix = typeof hexPrefixes[number]
const tlvPrefixes = ["nprofile", "nevent", "nrelay"]
type TLVPrefix = typeof tlvPrefixes[number]
type Prefix = HexPrefix | TLVPrefix
type Uint8 = number
type TLV = [Uint8, Uint8, Uint8Array]

const bech32Alphabet = "023456789acdefghjklmnpqrstuvwxyz"
const bech32AlphabetRegex = new RegExp(`[${ bech32Alphabet }]`)
const bech32Separator: Bech32Separator = "1"

export const isBech32Char = (char: unknown, separator = false) : char is Bech32Char => {
  if (isString(char) === false) return false
  if (char === bech32Separator) return separator
  return bech32AlphabetRegex.test(char)
}

export const areBech32Chars = (chars: unknown, separator = false) : chars is Bech32Chars => {
  if (isString(chars) === false) return false
  return Array.from(chars).every(char => isBech32Char(char, separator))
}

export const isBech32 = (bech32: unknown) : bech32 is Bech32 => {
  if (isString(bech32)) {
    try {
      baseBech32.decode(bech32, false)
      return true
    } catch (err) {
      return false
    }
  }
  return false
}

// @TODO: Do not decode twice
export const isNpub = (npub: unknown) : npub is Npub => {
  return isBech32(npub) && isBech32Prefix(npub, "npub")
}
// @TODO: Do not decode twice
export const isNsec = (nsec: unknown) : nsec is Nsec => {
  return isBech32(nsec) && isBech32Prefix(nsec, "nsec")
}
// @TODO: Do not decode twice
export const isNote = (note: unknown) : note is Note => {
  return isBech32(note) && isBech32Prefix(note, "note")
}

export const bech32Prefix = (bech32: Bech32) : string => {
  const { prefix } = baseBech32.decode(bech32, false)
  return prefix
}

export const isBech32Prefix = (bech32: Bech32, prefixToMatch: Prefix) : boolean => {
  const prefix = bech32Prefix(bech32)
  return prefix === prefixToMatch
}

export const isHexPrefix = (prefix: Prefix) : boolean => {
  return isIn(hexPrefixes, prefix)
}

export const isTLVPrefix = (prefix: Prefix) : boolean => {
  return isIn(tlvPrefixes, prefix)
}

export const bytesToBech32 = (bytes: Uint8Array, prefix: Prefix) : Bech32 => {
  return baseBech32.encode(prefix, baseBech32.toWords(bytes))
}

export const bech32ToBytes = (bech32: Bech32) : Uint8Array => {
  const { bytes } = baseBech32.decodeToBytes(bech32)
  return bytes
}

export const bech32ToHex = (bech32: Bech32) : Hex => {
  const bytes = bech32ToBytes(bech32)
  return createHexFromUint8Array(bytes)
}

export const hexToBech32 = (hex: Hex, prefix: Prefix) : Bech32 => {
  const bytes = hexToBytes(hex)
  return bytesToBech32(bytes, prefix)
}

export const createNpub = (publicKeyOrHex: PublicKey | PublicKeyHex) : Npub => {
  const prefix = "npub"
  return isPublicKeyHex(publicKeyOrHex) ? hexToBech32(publicKeyOrHex, prefix) : bytesToBech32(publicKeyOrHex, prefix)
}

export const createNsec = (privateKeyOrHex: PrivateKey | PrivateKeyHex) : Nsec => {
  const prefix = "nsec"
  return isPrivateKeyHex(privateKeyOrHex) ? hexToBech32(privateKeyOrHex, prefix) : bytesToBech32(privateKeyOrHex, prefix)
}

const splitFirstTLV = (bytes: Uint8Array) : [TLV, Uint8Array] => {
  const t = bytes[0]
  const l = bytes[1]
  if (isNot(l)) throw new Error(`${ bytes } is not a valid TLV`)
  const end = l + 2
  if (bytes.length < end) throw new Error(`${ bytes } is not a valid TLV`)
  const v = bytes.slice(2, end)
  const rest = bytes.slice(end)
  return [[t, l, v], rest]
}

const splitTLV = (bytes: Uint8Array) : TLV[] => {
  const tlvs: TLV[] = []
  let rest = bytes
  while (rest.length > 0) {
    const [first, r] = splitFirstTLV(rest)
    tlvs.push(first)
    rest = r
  }
  return tlvs
}

const parseTLV = (bytes: Uint8Array, prefix: TLVPrefix) : (Hex | string)[] => {
  const tlvs = splitTLV(bytes)
  return tlvs.map(([t,, v]) => {
    let value
    if (t === 0) {
      switch (prefix) {
        case "nprofile":
        case "nevent":
          value = bytesToHex(v)
          break
        case "nrelay":
          value = utf8Decode(v)
          break
      }
    } else if (t === 1) {
      value = utf8Decode(v)
    }
    if (value === undefined) throw new Error (`${ t } is not a supported TLV type`)
    return value
  })
}

export const decode = (bech32: Bech32) : { prefix: Prefix, value: Hex | string | (Hex | string)[] } => {
  const prefix = bech32Prefix(bech32)
  if (isHexPrefix(prefix)) {
    const value = bech32ToHex(bech32)
    return { prefix, value }
  } else if (isTLVPrefix(prefix)) {
    const { bytes } = baseBech32.decodeToBytes(bech32)
    const value = parseTLV(bytes, prefix)
    return { prefix, value }
  } else {
    throw new Error (`${ prefix } is not a supported prefix`)
  }
}
