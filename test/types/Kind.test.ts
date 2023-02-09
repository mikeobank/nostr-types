import { isKind, areKinds, kindByName, getKind } from "../../src/types/Kind"

test("isKind", () => {
  expect(isKind(5)).toBeFalsy()
  expect(isKind(0)).toBeTruthy()
})

test("areKinds", () => {
  expect(areKinds([0, 5])).toBeFalsy()
  expect(areKinds([0, 1])).toBeTruthy()
})

test("kindByName", () => {
  expect(kindByName("1")).toBeUndefined()
  expect(kindByName("set_metadata")).toBe(0)
  expect(kindByName("TEXT-NOTE")).toBe(1)
  expect(kindByName("text note")).toBe(1)
  expect(kindByName(" text  note ")).toBe(1)
  expect(kindByName("RECOMMEND_SERVER")).toBe(2)
  expect(kindByName("contact list")).toBe(3)
  expect(kindByName("encrypted dm")).toBe(4)
})

test("getKind", () => {
  expect(getKind("text_note")).toBe(1)
  expect(() => getKind("NON_EXISTING")).toThrow()
})