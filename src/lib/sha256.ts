import { sha256 } from "@noble/hashes/sha256"
import { encode } from "./utf8encoder.js"
import { createHexFromUint8Array } from "../types/Hex.js"

export default (s: string) => {
  return createHexFromUint8Array(sha256(encode(s)))
}
