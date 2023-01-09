import { createKeyPair, generateKeyPair, generatePrivateKey } from "../../src/types/KeyPair"
import privateKey from "../privateKey"

test("createKeyPair", () => {
  const { publicKey } = createKeyPair(privateKey)
  expect(publicKey.length).toBe(32)
})

test("generateKeyPair", () => {
  const { privateKey: privateKey2 } = generateKeyPair()
  expect(privateKey2).not.toEqual(privateKey)
})

test("generatePrivateKey", () => {
  const privateKey1 = generatePrivateKey()
  expect(privateKey1).not.toEqual(privateKey)
})
