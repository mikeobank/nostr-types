import { createId, isId } from "../../src/types/Id"
import { createKeyPair } from "../../src/types/KeyPair"
import { createHexFromUint8Array } from "../../src/types/Hex"
import privateKey from "../privateKey"

test("createId, isId", () => {
  const { publicKey } = createKeyPair(privateKey)
  const id = createId(createHexFromUint8Array(publicKey), 12345, 0, [], "")
  expect(isId(id)).toBeTruthy()
})
