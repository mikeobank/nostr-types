import { isUInt } from "../../../src/lib/utils/isInt"

test("negative number", () => {
  expect(isUInt(-1)).toBeFalsy()
})

test("NaN", () => {
  expect(isUInt(NaN)).toBeFalsy()
})

test("float", () => {
  expect(isUInt(0.1)).toBeFalsy()
})

test("uint", () => {
  expect(isUInt(2)).toBeTruthy()
})