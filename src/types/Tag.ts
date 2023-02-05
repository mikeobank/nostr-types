import type { PublicKeyHex } from "./PublicKey"
import type { Id } from "./Id"
import { isRelayURL, RelayURL } from "./RelayURL"

import isString from "../lib/utils/isString"
import isArray from "../lib/utils/isArray"
import { isHex32Bytes } from "./Hex"
import { isEmpty } from "../lib/utils/isEmpty"
import { isArrayOfSize } from "../lib/utils/isSize"

type TagName = "e" | "p" | string
export type Tag = [TagName, PublicKeyHex | Id, RelayURL | ""]
export type Tags = Tag[]

export const isTag = (tag: unknown) : tag is Tag => {
  if (isArrayOfSize(tag, 3)) {
    if (tag.every(isString)) {
      const [, hex32, relayURL] = tag
      if (isHex32Bytes(hex32) && (isRelayURL(relayURL) || isEmpty(relayURL))) {
        return true
      }
    }
  }
  return false
}

export const areTags = (tags: unknown) : tags is Tags => {
  return isArray(tags) && tags.every(isTag)
}