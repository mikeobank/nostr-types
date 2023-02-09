import { encrypt, decrypt, encryptEvent, decryptEvent, isEncryptedDM, isEncryptedDMSync } from "../../src/types/EncryptedDM"
import privateKey from "../privateKey"
import { generateKeyPair, createKeyPair } from "../../src/types/KeyPair"
import { createEvent, createEventSync } from "../../src/types/NostrEvent"
import { createHexFromUint8Array } from "../../src/types/Hex"

test("encrypt, decrypt", async () => {
  const keyPairFrom = createKeyPair(privateKey)
  const keyPairTo = generateKeyPair()
  const message = "hello"
  const encryptedMessage = await encrypt(keyPairFrom.privateKey)(keyPairTo.publicKey, message)
  expect(encryptedMessage).not.toBe(message)
  const decryptedMessage = await decrypt(keyPairTo.privateKey)(keyPairFrom.publicKey, encryptedMessage)
  expect(decryptedMessage).toBe(message)
})

test("encryptEvent, decryptEvent", async () => {
  const keyPairFrom = createKeyPair(privateKey)
  const keyPairTo = generateKeyPair()
  const event = await createEvent(privateKey)(1, [], "hello")
  const encryptedDM = await encryptEvent(privateKey)(keyPairTo.publicKey, event)
  expect(encryptedDM.kind).toBe(4)
  expect(encryptedDM.content).not.toBe(event.content)
  expect(encryptedDM.id).not.toBe(event.id)
  expect(encryptedDM.tags[0]).toEqual(["p", createHexFromUint8Array(keyPairTo.publicKey)])
  const decryptedEvent = await decryptEvent(keyPairTo.privateKey)(encryptedDM)
  expect(decryptedEvent.content).toBe("hello")
  expect(decryptedEvent.pubkey).toBe(createHexFromUint8Array(keyPairFrom.publicKey))
})

test("isEncryptedDM", async () => {
  const event = await createEvent(privateKey)(1, [], "hello")
  expect(await isEncryptedDM(event)).toBeFalsy()
  const { publicKey } = generateKeyPair()
  const encryptedDM = await encryptEvent(privateKey)(publicKey, event)
  expect(await isEncryptedDM(encryptedDM)).toBeTruthy()
})

test("isEncryptedDMSync", async () => {
  const event = createEventSync(privateKey)(1, [], "hello")
  expect(isEncryptedDMSync(event)).toBeFalsy()
  const { publicKey } = generateKeyPair()
  const encryptedDM = await encryptEvent(privateKey)(publicKey, event)
  expect(isEncryptedDMSync(encryptedDM)).toBeTruthy()
})