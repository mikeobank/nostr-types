import { sha256 } from "@noble/hashes/sha256"
import { encode } from "./utf8encoder"
import { createHexFromUint8Array } from "../types/Hex"

export default (s: string) => {
  return createHexFromUint8Array(sha256(encode(s)))
}
