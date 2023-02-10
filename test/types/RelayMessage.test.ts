import {
  createRelayEventMessage,
  createRelayNoticeMessage,
  createRelayEOSEMessage,
  createRelayOKMessage,
  createRelayAuthMessage,
  isRelayEventMessage,
  isRelayNoticeMessage,
  isRelayEOSEMessage,
  isRelayOKMessage,
  isRelayAuthMessage
} from "../../src/types/RelayMessage"
import { createEvent } from "../../src/types/NostrEvent"
import privateKey from "../privateKey"
import hex32 from "../hex32"

test("createRelayEventMessage", async () => {
  const event = await createEvent(privateKey)(1, [], "a")
  const message = createRelayEventMessage("subscriptionId", event)
  expect(message.length).toBe(3)
  expect(message[0]).toBe("EVENT")
  expect(message[1]).toBe("subscriptionId")
  expect(message[2]).toBe(event)
})

test("createRelayNoticeMessage", async () => {
  const message = createRelayNoticeMessage("message")
  expect(message.length).toBe(2)
  expect(message[0]).toBe("NOTICE")
  expect(message[1]).toBe("message")
})

test("createRelayEOSE", async () => {
  const message = createRelayEOSEMessage("subscriptionId")
  expect(message.length).toBe(2)
  expect(message[0]).toBe("EOSE")
  expect(message[1]).toBe("subscriptionId")
})

test("createRelayOKMessage", async () => {
  const message = createRelayOKMessage(hex32, true, "pow: difficulty 25>=24")
  expect(message.length).toBe(4)
  expect(message[0]).toBe("OK")
  expect(message[1]).toBe(hex32)
  expect(message[2]).toBe(true)
  expect(message[3]).toBe("pow: difficulty 25>=24")
})

test("createRelayAuthMessage", async () => {
  const message = createRelayAuthMessage("challenge string")
  expect(message.length).toBe(2)
  expect(message[0]).toBe("AUTH")
  expect(message[1]).toBe("challenge string")
})

test("isRelayEventMessage", async () => {
  const event = await createEvent(privateKey)(1, [], "a")
  const message = createRelayEventMessage("subscriptionId", event)
  expect(await isRelayEventMessage(message)).toBeTruthy()
  message[2].sig = "invalid"
  expect(await isRelayEventMessage(message)).toBeFalsy()
})

test("isRelayNoticeMessage", () => {
  const message = createRelayNoticeMessage("message")
  expect(isRelayNoticeMessage(message)).toBeTruthy()
})

test("isRelayEOSEMessage", () => {
  const message = createRelayEOSEMessage("subscriptionId")
  expect(isRelayEOSEMessage(message)).toBeTruthy()
})

test("isRelayOKMessage", () => {
  const message = createRelayOKMessage(hex32, true, "pow: difficulty 25>=24")
  expect(isRelayOKMessage(message)).toBeTruthy()
})

test("isRelayAuthMessage", () => {
  const message = createRelayAuthMessage("challenge string")
  expect(isRelayAuthMessage(message)).toBeTruthy()
})