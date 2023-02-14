import { createSubscriptionId, isSubscriptionId } from "../../src/types/SubscriptionId"

test("SubscriptionId", () => {
  expect(isSubscriptionId(1)).toBeFalsy()
  expect(isSubscriptionId("")).toBeFalsy()
  expect(isSubscriptionId("a")).toBeTruthy()
})

test("createSubscriptionId", () => {
  expect(createSubscriptionId({})).toBe("44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a")
  expect(createSubscriptionId({}, 16)).toBe("44136fa355b3678a")
  expect(createSubscriptionId()).not.toBe(createSubscriptionId({}))
})