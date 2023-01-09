import { createSignature, createSignatureSync, isSignature, verifySignature, verifySignatureSync, sign, signSync, verify, verifySync } from "../../src/types/Signature"
import { createKeyPair } from "../../src/types/KeyPair"
import { createHexFromUint8Array } from "../../src/types/Hex"
import privateKey from "../privateKey"
import hex32 from "../hex32"

test("Signature", async () => {
  const signature = await createSignature(privateKey)(hex32)
  expect(isSignature(signature)).toBeTruthy()
  const { publicKey } = createKeyPair(privateKey)
  expect(await verifySignature(createHexFromUint8Array(publicKey), hex32, signature)).toBeTruthy()
})

test("Signature sync", () => {
  const signature = createSignatureSync(privateKey)(hex32)
  expect(isSignature(signature)).toBeTruthy()
  const { publicKey } = createKeyPair(privateKey)
  expect(verifySignatureSync(createHexFromUint8Array(publicKey), hex32, signature)).toBeTruthy()
})

test("sign, verify", async () => {
  const message = hex32
  const { publicKey, signature } = await sign(privateKey)(message)
  expect(await verify(publicKey, message, signature)).toBeTruthy()
})

test("sign, verify sync", async () => {
  const message = hex32
  const { publicKey, signature } = signSync(privateKey)(message)
  expect(verifySync(publicKey, message, signature)).toBeTruthy()
})