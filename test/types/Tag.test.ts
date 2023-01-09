import { isTag, areTags } from "../../src/types/Tag"
import hex32 from "../hex32"

test("isTag", () => {
  expect(isTag(["e"])).toBeFalsy()
  expect(isTag(["e", hex32])).toBeFalsy()
  expect(isTag(["e", hex32, ""])).toBeTruthy()
  expect(isTag(["e", "0a", ""])).toBeFalsy()
  expect(isTag(["custom", hex32, "ws://example.com"])).toBeTruthy()
})

test("areTags", () => {
  expect(areTags(["e"])).toBeFalsy()
  expect(areTags([["e", hex32, ""]])).toBeTruthy()
})