import { createId, isId, calculateDifficulty, hasDifficulty } from "../../src/types/Id"
import { createKeyPair } from "../../src/types/KeyPair"
import { createHexFromUint8Array } from "../../src/types/Hex"
import privateKey from "../privateKey"
import hex32 from "../hex32"

test("createId, isId", () => {
  const { publicKey } = createKeyPair(privateKey)
  const id = createId(createHexFromUint8Array(publicKey), 12345, 0, [], "")
  expect(isId(id)).toBeTruthy()
})

test("calculateDifficulty", () => {
  expect(calculateDifficulty("1")).toBe(0)
  expect(calculateDifficulty("01")).toBe(4)
  expect(calculateDifficulty("000000000e9d97a1ab09fc381030b346cdd7a142ad57e6df0b46dc9bef6c7e2d")).toBe(36)
})

test("hasDifficulty", () => {
  expect(hasDifficulty("1")).toBeFalsy()
  expect(hasDifficulty("000000000e9d97a1ab09fc381030b346cdd7a142ad57e6df0b46dc9bef6c7e2d")).toBeTruthy()
})
