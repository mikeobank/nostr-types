import { isPublicKeyHex, arePublicKeyHexes, isPublicKeyHexPrefix, arePublicKeyHexPrefixes } from "../../src/types/PublicKey"
import hex32 from "../hex32"

test("isPublicKeyHex", () => {
  expect(isPublicKeyHex(new Uint8Array())).toBeFalsy()
  expect(isPublicKeyHex("a")).toBeFalsy()
  expect(isPublicKeyHex(hex32)).toBeTruthy()
})

test("arePublicKeyHexes", () => {
  expect(arePublicKeyHexes(["a", hex32])).toBeFalsy()
})

test("isPublicKeyHexPrefix", () => {
  expect(isPublicKeyHexPrefix(new Uint8Array())).toBeFalsy()
  expect(isPublicKeyHexPrefix("a")).toBeTruthy()
  expect(isPublicKeyHexPrefix(hex32)).toBeTruthy()
})

test("arePublicKeyHexPrefixes", () => {
  expect(arePublicKeyHexPrefixes(["a", hex32])).toBeTruthy()
})