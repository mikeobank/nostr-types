import isString from "../lib/utils/isString"
import { isNotEmpty } from "../lib/utils/isEmpty"
import isBrowser from "../lib/utils/isBrowser"

export type Base64 = string

export const isBase64 = (base64: unknown) : base64 is Base64 => {
  if (isString(base64) && isNotEmpty(base64)) {
    if (isBrowser) {
      try {
        atob(base64)
        return true
      } catch (err) {}
    } else {
      const buffer = Buffer.from(base64, "base64")
      return buffer.length > 0
    }
  }
  return false
}