import isIn from "../../../src/lib/utils/isIn"

test("isIn", () => {
  expect(isIn(["a", "b", "c"], "d")).toBeFalsy()
  expect(isIn(["a", "b", "c"], "a")).toBeTruthy()
})