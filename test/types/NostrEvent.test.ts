import { createEvent, verifyEvent, verifyEventSync, parseEvent, parseEventSync, parseEvents, parseEventsSync, isReplaceableEvent, isEphemeralEvent, isParameterizedReplaceableEvent } from "../../src/types/NostrEvent"
import privateKey from "../privateKey"

test("createEvent", async () => {
  const event = await createEvent(privateKey)(0, [], "", 12345)
  expect(event.created_at).toBe(12345)
})

test("createEvent by Kind name", async () => {
  const event = await createEvent(privateKey)("text_note")
  expect(event.kind).toBe(1)
  expect(async () => await createEvent(privateKey)("NON_EXISTING")).rejects.toThrow()
})

test("verifyEvent", async () => {
  const event = await createEvent(privateKey)(0)
  expect(await verifyEvent(event)).toBeTruthy()
  expect(verifyEventSync(event)).toBeTruthy()
})

test("verifyEvent with invalid id", async () => {
  const event = await createEvent(privateKey)(0)
  event.id = "invalid"
  expect(await verifyEvent(event)).toBeFalsy()
  expect(verifyEventSync(event)).toBeFalsy()
})

test("verifyEvent with invalid signature", async () => {
  const event = await createEvent(privateKey)(0)
  event.sig = "invalid"
  expect(await verifyEvent(event)).toBeFalsy()
  expect(verifyEventSync(event)).toBeFalsy()
})

test("parseEvent", async () => {
  const event = await createEvent(privateKey)(0)
  expect(async () => await parseEvent(event)).not.toThrow()
  expect(() => parseEventSync(event)).not.toThrow()
})

test("parseEvents", async () => {
  expect(await parseEvents(undefined)).toHaveLength(0)
  expect(await parseEvents([])).toHaveLength(0)
  expect(await parseEvents([{}, {}])).toHaveLength(0)
  const event = await createEvent(privateKey)(0)
  const event1 = await createEvent(privateKey)(1)
  expect(await parseEvents([event, event1])).toHaveLength(2)
  expect(parseEventsSync([event, event1])).toHaveLength(2)
})

test("isReplaceableEvent", async () => {
  const event = await createEvent(privateKey)(10000)
  expect(isReplaceableEvent(event)).toBeTruthy()
})

test("isParameterizedReplaceableEvent", async () => {
  const event = await createEvent(privateKey)(30000)
  expect(isParameterizedReplaceableEvent(event)).toBeTruthy()
})

test("isEphemeralEvent", async () => {
  const event = await createEvent(privateKey)(20000)
  expect(isEphemeralEvent(event)).toBeTruthy()
})