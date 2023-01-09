import isNumber from "../../../src/lib/utils/isNumber"

test("isNumber", () => {
  expect(isNumber(0)).toBeTruthy()
  expect(isNumber(1)).toBeTruthy()
  expect(isNumber(-1)).toBeTruthy()
  expect(isNumber(0.1)).toBeTruthy()
  expect(isNumber(Number.NEGATIVE_INFINITY)).toBeTruthy()
  expect(isNumber(Number.NaN)).toBeFalsy()
})

