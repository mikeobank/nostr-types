import { createClientCloseMessage, createClientEventMessage, createClientReqMessage } from "../../src/types/ClientMessage"
import { createEvent } from "../../src/types/NostrEvent"
import privateKey from "../privateKey"

test("createClientEventMessage", async () => {
  const event = await createEvent(privateKey)(1, [], "a")
  const message = createClientEventMessage(event)
  expect(message.length).toBe(2)
  expect(message[0]).toBe("EVENT")
  expect(message[1]).toBe(event)
})

test("createClientReqMessage", async () => {
  const message = createClientReqMessage("subscriptionId", {})
  expect(message.length).toBe(3)
  expect(message[0]).toBe("REQ")
  expect(message[1]).toBe("subscriptionId")
  expect(message[2]).toEqual({})
})

test("createClientCloseMessage", async () => {
  const message = createClientCloseMessage("subscriptionId")
  expect(message.length).toBe(2)
  expect(message[0]).toBe("CLOSE")
  expect(message[1]).toBe("subscriptionId")
})