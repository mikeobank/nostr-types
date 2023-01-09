import { createRelayEventMessage, createRelayNoticeMessage, isRelayEventMessage, isRelayNoticeMessage } from "../../src/types/RelayMessage"
import { createEvent } from "../../src/types/NostrEvent"
import privateKey from "../privateKey"

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