import { createUnixTimestamp, now } from "../../src/types/UnixTimestamp"

test("createUnixTimestamp", () => {
  expect(createUnixTimestamp("")).toBeUndefined()
  expect(createUnixTimestamp("2023-01-14")).not.toBeUndefined()
  expect(createUnixTimestamp("1673726256")).not.toBeUndefined()
})

test("now", () => {
  // Some time during 14 Jan 2023
  const past = 1673726256
  expect(now()).toBeGreaterThan(past)
})