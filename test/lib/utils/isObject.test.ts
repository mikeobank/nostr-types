import isObject from "../../../src/lib/utils/isObject"

test("objects", () => {
  expect(isObject({})).toBeTruthy()
  expect(isObject({ k: "v" })).toBeTruthy()
})

test("non objects", () => {
  expect(isObject(null)).toBeFalsy()
  expect(isObject(function () {})).toBeFalsy()
  expect(isObject([])).toBeFalsy()
})