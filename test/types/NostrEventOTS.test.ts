import { isEventOTS, isEventOTSSync } from "../../src/types/NostrEventOTS"
import { createEvent } from "../../src/types/NostrEvent"
import privateKey from "../privateKey"

test("isEventOTS", async () => {
  const event = await createEvent(privateKey)(0, [], "", 12345)
  expect(await isEventOTS(event)).toBeFalsy()
  expect(isEventOTSSync(event)).toBeFalsy()
  const eventOTS = { ...event, ots: "Tm9zdHI=" }
  expect(await isEventOTS(eventOTS)).toBeTruthy()
  expect(isEventOTSSync(eventOTS)).toBeTruthy()
})
