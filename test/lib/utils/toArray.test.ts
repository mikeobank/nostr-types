import toArray from "../../../src/lib/utils/toArray"

test("array", () => {
  expect(toArray([])).toEqual([])
  expect(toArray([1])).toEqual([1])
  expect(toArray([1, 2])).toEqual([1, 2])
})

test("single value", () => {
  expect(toArray(1)).toEqual([1])
  expect(toArray(undefined)).toEqual([undefined])
  expect(toArray({ a: "A" })).toEqual([{ a: "A" }])
})