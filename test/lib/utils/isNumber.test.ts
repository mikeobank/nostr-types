import { isNumber, isInt, isUInt, isByte } from "../../../src/lib/utils/isNumber"

test("isNumber", () => {
  expect(isNumber(0)).toBeTruthy()
  expect(isNumber(1)).toBeTruthy()
  expect(isNumber(-1)).toBeTruthy()
  expect(isNumber(0.1)).toBeTruthy()
  expect(isNumber(Number.NEGATIVE_INFINITY)).toBeTruthy()
  expect(isNumber(Number.NaN)).toBeFalsy()
})

test("isInt", () => {
  expect(isInt(-0.1)).toBeFalsy()
  expect(isInt(2)).toBeTruthy()
})

test("isUInt", () => {
  expect(isUInt(-1)).toBeFalsy()
  expect(isUInt(NaN)).toBeFalsy()
  expect(isUInt(0.1)).toBeFalsy()
  expect(isUInt(3)).toBeTruthy()
})

test("isByte", () => {
  expect(isByte(-1)).toBeFalsy()
  expect(isByte(512)).toBeFalsy()
  expect(isByte(16)).toBeTruthy()
})
