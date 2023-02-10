import { createUnixTimestamp, now, isInBetween } from "../../src/types/UnixTimestamp"

test("createUnixTimestamp", () => {
  expect(createUnixTimestamp("")).toBeUndefined()
  expect(createUnixTimestamp("1673726256")).toBeUndefined()
  expect(createUnixTimestamp("2023-01-14")).not.toBeUndefined()
})

test("now", () => {
  // Some time during 14 Jan 2023
  const past = 1673726256
  expect(now()).toBeGreaterThan(past)
})

test("isInBetween", () => {
  expect(isInBetween(1673726256, 2000000000)).toBeFalsy()
  expect(isInBetween(1673726256, 1000000000)).toBeTruthy()
  expect(isInBetween(1673726256, 1000000000, 1500000000)).toBeFalsy()
  expect(isInBetween(1673726256, 1000000000, 2000000000)).toBeTruthy()
})