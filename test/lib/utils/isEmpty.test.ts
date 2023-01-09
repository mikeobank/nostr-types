import { isEmpty, isNotEmpty } from "../../../src/lib/utils/isEmpty"

test("isEmpty", () => {
  expect(isEmpty("")).toBeTruthy()
  expect(isEmpty("a")).toBeFalsy()
  expect(isEmpty([])).toBeTruthy()
  expect(isEmpty(["a"])).toBeFalsy()
  expect(isEmpty({})).toBeTruthy()
  expect(isEmpty({ a: "a" })).toBeFalsy()
})

test("isNotEmpty", () => {
  expect(isNotEmpty("")).toBeFalsy()
})
