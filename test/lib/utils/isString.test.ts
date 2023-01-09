import isString from "../../../src/lib/utils/isString"

test("isString", () => {
  expect(isString("")).toBeTruthy()
  expect(isString("a")).toBeTruthy()
  expect(isString(1)).toBeFalsy()
  expect(isString(["a"])).toBeFalsy()
})

