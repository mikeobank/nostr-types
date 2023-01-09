import { isSubscriptionId } from "../../src/types/SubscriptionId"

test("SubscriptionId", () => {
  expect(isSubscriptionId(1)).toBeFalsy()
  expect(isSubscriptionId("")).toBeFalsy()
  expect(isSubscriptionId("a")).toBeTruthy()
})