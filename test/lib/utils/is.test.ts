import { is, isNot } from "../../../src/lib/utils/is"

test("is", () => {
  expect(is(undefined)).toBeFalsy()
  expect(is(null)).toBeFalsy()
  expect(is(0)).toBeTruthy()
  expect(is("")).toBeTruthy()
  expect(is([])).toBeTruthy()
})

test("isNot", () => {
  expect(isNot(undefined)).toBeTruthy()
  expect(isNot(null)).toBeTruthy()
  expect(isNot(0)).toBeFalsy()
})

