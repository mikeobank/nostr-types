import { createUnixTimestamp, now, isInBetween, millisecondsToSeconds, secondsToMilliseconds, unixTimestampToDate } from "../../src/types/UnixTimestamp"

test("seconds <=> milliseconds", () => {
  expect(millisecondsToSeconds(secondsToMilliseconds(1673726256))).toBe(1673726256)
})

test("createUnixTimestamp", () => {
  expect(createUnixTimestamp("")).toBeUndefined()
  expect(createUnixTimestamp("1673726256")).toBeUndefined()
  expect(createUnixTimestamp("2023-01-14")).not.toBeUndefined()
})

test("unixTimestampToDate", () => {
  expect(unixTimestampToDate(1673726256)).toBeInstanceOf(Date)
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