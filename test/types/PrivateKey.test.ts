import { isPrivateKeyHex, generatePrivateKey, createPrivateKeyHex, createPrivateKeyFromHex } from "../../src/types/PrivateKey"
import privateKey from "../privateKey"
import hex32 from "../hex32"

test("isPrivateKeyHex", () => {
  expect(isPrivateKeyHex(new Uint8Array())).toBeFalsy()
  expect(isPrivateKeyHex("a")).toBeFalsy()
  expect(isPrivateKeyHex(hex32)).toBeTruthy()
  expect(isPrivateKeyHex(createPrivateKeyHex(privateKey))).toBeTruthy()
})

test("createPrivateKeyHex", () => {
  expect(createPrivateKeyHex(privateKey)).toBe("d08dbfadab93b19be89e906dcafff7053ff5f201511c25395e154e5c83894f43")
})

test("createPrivateKey", () => {
  expect(createPrivateKeyFromHex("d08dbfadab93b19be89e906dcafff7053ff5f201511c25395e154e5c83894f43")).toStrictEqual(privateKey)
})

test("generatePrivateKey", () => {
  const privateKey1 = generatePrivateKey()
  expect(privateKey1).not.toEqual(privateKey)
})