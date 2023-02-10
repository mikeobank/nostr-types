import { isKind, areKinds, kindByName, getKind, isReplaceableKind, isEphemeralKind, isParameterizedReplaceableKind } from "../../src/types/Kind"

test("isKind", () => {
  expect(isKind(-1)).toBeFalsy()
  expect(isKind(0)).toBeTruthy()
})

test("areKinds", () => {
  expect(areKinds([0, -1])).toBeFalsy()
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
  expect(kindByName("deletion")).toBe(5)
})

test("getKind", () => {
  expect(getKind("text_note")).toBe(1)
  expect(() => getKind("NON_EXISTING")).toThrow()
})

test("isReplaceableKind", () => {
  expect(isReplaceableKind(9999)).toBeFalsy()
  expect(isReplaceableKind(20000)).toBeFalsy()
  expect(isReplaceableKind(10000)).toBeTruthy()
})

test("isParameterizedReplaceableKind", () => {
  expect(isParameterizedReplaceableKind(9999)).toBeFalsy()
  expect(isParameterizedReplaceableKind(40000)).toBeFalsy()
  expect(isParameterizedReplaceableKind(30000)).toBeTruthy()
})

test("isEphemeralKind", () => {
  expect(isEphemeralKind(19999)).toBeFalsy()
  expect(isEphemeralKind(31000)).toBeFalsy()
  expect(isEphemeralKind(20000)).toBeTruthy()
})