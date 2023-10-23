import type { PublicKeyHex } from "./PublicKey.js"
import type { UnixTimestamp } from "./UnixTimestamp.js"

import sha256 from "../lib/sha256.js"
import { isHex, isHex32Bytes } from "./Hex.js"
import isString from "../lib/utils/isString.js"
import { isNotEmpty } from "../lib/utils/isEmpty.js"
import { Kind } from "./Kind.js"
import { Tags } from "./Tag.js"
import { Content } from "./Content.js"

export type Id = string // 32 bytes sha-256, lowercase hex encoded
export type IdPrefix = string // partial Id (from start)

export const createId = (pubkey: PublicKeyHex, created_at: UnixTimestamp, kind: Kind, tags: Tags, content: Content) => {
  const str = JSON.stringify([
    0,
    pubkey,
    created_at,
    kind,
    tags,
    content
  ])
  return sha256(str)
}

export const isId = (id: unknown) : id is Id => {
  return isString(id) && isHex32Bytes(id)
}

export const areIds = (ids: unknown[]) : ids is Id[] => {
  return ids.every(isId)
}

export const isIdPrefix = (idPrefix: unknown) : idPrefix is IdPrefix => {
  return isString(idPrefix) && isNotEmpty(idPrefix) && isHex(idPrefix)
}

export const areIdPrefixes = (idPrefixes: unknown[]) : idPrefixes is IdPrefix[] => {
  return idPrefixes.every(isIdPrefix)
}

export const calculateDifficulty = (id: Id | IdPrefix) : number => {
  const numLeadingZeros = id.length - id.replace(/^0+/, "").length
  return numLeadingZeros * 4
}

export const hasDifficulty = (id: Id | IdPrefix) : boolean => {
  return calculateDifficulty(id) > 0
}