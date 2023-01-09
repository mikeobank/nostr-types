import isArray from "../../../src/lib/utils/isArray"

test("isArray", () => {
  expect(isArray([])).toBeTruthy()
  expect(isArray(["a", "b"])).toBeTruthy()
  expect(isArray({})).toBeFalsy()
  expect(isArray(undefined)).toBeFalsy()
})
