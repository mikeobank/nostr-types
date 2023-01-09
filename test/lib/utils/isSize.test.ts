import { isSize, isArrayOfSize } from "../../../src/lib/utils/isSize"

test("isSize", () => {
  expect(isSize([], 0)).toBeTruthy()
  expect(isSize(["a"], 1)).toBeTruthy()
  expect(isSize(["a", "b"], 2)).toBeTruthy()
  expect(isSize(["a", "b"], 3)).toBeFalsy()
  expect(isSize(["a", "b"], 1)).toBeFalsy()
  expect(isSize(["a", "b"], 1, true)).toBeTruthy()
})

test("isArrayOfSize", () => {
  expect(isArrayOfSize({}, 1)).toBeFalsy()
  expect(isArrayOfSize(["a", "b"], 2)).toBeTruthy()
  expect(isArrayOfSize(["a", "b"], 3)).toBeFalsy()
})