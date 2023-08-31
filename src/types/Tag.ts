import { Id, isId } from "./Id"
import { isRelayURL, RelayURL } from "./RelayURL"
import { isPublicKeyHex, PublicKeyHex } from "./PublicKey"
import { ConditionsQueryString, isConditionsQueryString } from "./DelegationString"
import { isSignature, SignatureHex } from "./Signature"
import { isUInt } from "../lib/utils/isNumber"
import isString from "../lib/utils/isString"
import isArray from "../lib/utils/isArray"
import { isArrayOfSize } from "../lib/utils/isSize"
import { isEmpty, isNotEmpty } from "../lib/utils/isEmpty"
import isIn from "../lib/utils/isIn"

export type TagName = string
export type Tag = string[]
export type Tags = Tag[]

export const isTagName = (tagName: unknown) => {
  return isString(tagName) && isNotEmpty(tagName)
}

export const isTag = (tag: unknown) : tag is Tag => {
  return isArrayOfSize(tag, 1, true) && tag.every(isString) && isNotEmpty(tag[0])
}

export const areTags = (tags: unknown) : tags is Tags => {
  return isArray(tags) && tags.every(isTag)
}

const getTagName = (tag: Tag) : TagName => {
  const [tagName] = tag
  return tagName
}

export const hasTagName = (tag: Tag, tagName: TagName) : boolean => {
  return tagName === getTagName(tag)
}



export const appendTag = (tags: Tags, tag: Tag) : Tags => {
  return [...tags, tag]
}

// Specific Tags


type PetName = string
const isPetName = (petName: unknown) : petName is PetName => isString(petName) && isNotEmpty(petName)

const markers = ["reply", "root", "mention"]
type Marker = typeof markers[number]
const isMarker = (marker: unknown) : marker is Marker => isIn(markers, marker)

type NumberString = string
const isNumberString = (numberString: unknown) : numberString is NumberString => {
  return isString(numberString) && isUInt(parseInt(numberString, 10))
}

const readOrWrite = ["read", "write"]
type ReadOrWrite = typeof readOrWrite[number]
const isReadOrWrite = (rw: unknown) : rw is ReadOrWrite => isIn(readOrWrite, rw)

const reportTypes = ["nudity", "profanity", "illegal", "spam", "impersonation"]
type ReportType = typeof reportTypes[number]
const isReportType = (reportType: unknown) : reportType is ReportType => isIn(reportTypes, reportType)

export const specificTagNames = ["e", "p", "nonce", "subject", "delegation", "d", "content-warning", "expiration", "relay", "challenge", "r"]
export type SpecificTagName = typeof specificTagNames[number]
export const isSpecificTagName = (tagName: unknown) : tagName is TagName => {
  return isIn(specificTagNames, tagName)
}

type ETag = ["e", Id, RelayURL, Marker] | ["e", Id, RelayURL | ""] | ["e", Id, ReportType] | ["e", Id] // NIP-01, NIP-56
type PTag = ["p", PublicKeyHex, RelayURL | "", PetName] | ["p", PublicKeyHex, RelayURL | ""] | ["p", PublicKeyHex, ReportType] | ["p", PublicKeyHex] // NIP-01, NIP-04, NIP-56
type NonceTag = ["nonce", NumberString, NumberString] // NIP-13
type SubjectTag = ["subject", string] // NIP-14
type DelegationTag = ["delegation", PublicKeyHex, ConditionsQueryString, SignatureHex] // NIP-26
type DTag = ["d", string] // NIP-33
type ContentWarningTag = ["content-warning"] | ["content-warning", string] // NIP-36
type ExpirationTag = ["expiration", string] // NIP-40
type RelayTag = ["relay", RelayURL] // NIP-42
type ChallengeTag = ["challenge", string] // NIP-42
type RTag = ["r", RelayURL, ReadOrWrite] | ["r", RelayURL] // NIP-65
export type SpecificTag = ETag | PTag | NonceTag | SubjectTag | DelegationTag | DTag | ContentWarningTag | ExpirationTag | RelayTag | ChallengeTag | RTag

const isTagWith = (tag: unknown, tagName: TagName, size: number, min = false) : tag is Tag => {
  if (isTag(tag)) {
    if (hasTagName(tag, tagName) === false) return false
    if (isArrayOfSize(tag, size, min) === false) return false
    return true
  }
  return false
}

export const isETag = (tag: unknown) : tag is ETag => {
  if (isTagWith(tag, "e", 3, true)) {
    const [, ...fields] = tag
    if (isId(fields[0]) === false) return false
    if (isArrayOfSize(tag, 3)) {
      if (isEmpty(fields[1]) === false && isRelayURL(fields[1]) === false && isReportType(fields[1]) === false) return false
    }
    else if (isArrayOfSize(tag, 4)) {
      if (isRelayURL(fields[1]) === false) return false
      if (isMarker(fields[2]) === false) return false
    }
    return true
  }
  return false
}

export const isPTag = (tag: unknown) : tag is PTag  => {
  if (isTagWith(tag, "p", 3, true)) {
    const [, ...fields] = tag
    if (isPublicKeyHex(fields[0]) === false) return false
    if (isArrayOfSize(tag, 3)) {
      if (isEmpty(fields[1]) === false && isRelayURL(fields[1]) === false && isReportType(fields[1]) === false) return false
    }
    else if (isArrayOfSize(tag, 4)) {
      if (isEmpty(fields[1]) === false && isRelayURL(fields[1]) === false) return false
      if (isPetName(fields[2]) === false) return false
    }
    return true
  }
  return false
}

export const isNonceTag = (tag: unknown) : tag is NonceTag => {
  if (isTagWith(tag, "nonce", 3)) {
    const [, ...fields] = tag
    if (isNumberString(fields[0]) === false || isNumberString(fields[1]) === false) return false
    return true
  }
  return false
}

export const isSubjectTag = (tag: unknown) : tag is SubjectTag => {
  if (isTagWith(tag, "subject", 2)) {
    const [, ...fields] = tag
    if (isString(fields[0]) === false) return false
    return true
  }
  return false
}

export const isDelegationTag = (tag: unknown) : tag is DelegationTag => {
  if (isTagWith(tag, "delegation", 4)) {
    const [, ...fields] = tag
    if (isPublicKeyHex(fields[0]) === false) return false
    if (isConditionsQueryString(fields[1]) === false) return false
    if (isSignature(fields[2]) === false) return false
    return true
  }
  return false
}

export const isDTag = (tag: unknown) : tag is DTag => {
  if (isTagWith(tag, "d", 2)) {
    const [, ...fields] = tag
    if (isString(fields[0]) === false) return false
    return true
  }
  return false
}

export const isContentWarningTag = (tag: unknown) : tag is ContentWarningTag => {
  if (isTagWith(tag, "content-warning", 1, true)) {
    const [, ...fields] = tag
    if (isArrayOfSize(tag, 2) && isString(fields[0]) === false) return false
    return true
  }
  return false
}

export const isExpirationTag = (tag: unknown) : tag is ExpirationTag => {
  if (isTagWith(tag, "expiration", 2)) {
    const [, ...fields] = tag
    if (isNumberString(fields[0]) === false) return false
    return true
  }
  return false
}

export const isRelayTag = (tag: unknown) : tag is RelayTag => {
  if (isTagWith(tag, "relay", 2)) {
    const [, ...fields] = tag
    if (isRelayURL(fields[0]) === false) return false
    return true
  }
  return false
}

export const isChallengeTag = (tag: unknown) : tag is ChallengeTag => {
  if (isTagWith(tag, "challenge", 2)) {
    const [, ...fields] = tag
    if (isString(fields[0]) === false) return false
    return true
  }
  return false
}

export const isRTag = (tag: unknown) : tag is RTag => {
  if (isTagWith(tag, "r", 2, true)) {
    const [, ...fields] = tag
    if (isRelayURL(fields[0]) === false) return false
    if (isArrayOfSize(tag, 3) && isReadOrWrite(fields[1]) === false) return false
    return true
  }
  return false
}

export const isSpecificTag = <T extends SpecificTag>(tag: T) : boolean => {
  const [tagName] = tag
  // @TODO: Sort alphabetically
  switch (tagName) {
    case "e":
      return isETag(tag)
    case "p":
      return isPTag(tag)
    case "nonce":
      return isNonceTag(tag)
    case "subject":
      return isSubjectTag(tag)
    case "delegation":
      return isDelegationTag(tag)
    case "d":
      return isDTag(tag)
    case "content-warning":
      return isContentWarningTag(tag)
    case "expiration":
      return isExpirationTag(tag)
    case "relay":
      return isRelayTag(tag)
    case "challenge":
      return isChallengeTag(tag)
    case "r":
      return isRTag(tag)
  }
}



