import isString from "../lib/utils/isString.js"
import { isNotEmpty } from "../lib/utils/isEmpty.js"
import isBrowser from "../lib/utils/isBrowser.js"
import { encode, decode } from "../lib/utf8encoder.js"

export type Base64 = string

export const isBase64 = (base64: unknown) : base64 is Base64 => {
  if (isString(base64) && isNotEmpty(base64)) {
    try {
      const bytes = base64ToBytes(base64)
      return bytes.length > 0
    } catch (err) {
      return false
    }
  }
  return false
}

export const bytesToBase64 = (arr: Uint8Array) : Base64 => {
  return isBrowser ? btoa(decode(arr)) : Buffer.from(arr).toString("base64")
}

export const base64ToBytes = (base64: Base64) : Uint8Array => {
  return isBrowser ? encode(atob(base64)) : Buffer.from(base64, "base64")
}