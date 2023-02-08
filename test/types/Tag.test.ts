import { isTag, areTags, appendTag } from "../../src/types/Tag"
import hex32 from "../hex32"

test("isTag", () => {
  expect(isTag(["e"])).toBeFalsy()
  expect(isTag(["e", hex32, ""])).toBeTruthy()
  expect(isTag(["custom", hex32, "ws://example.com"])).toBeTruthy()
  expect(isTag(["p", hex32, "ws://example.com", "pet name"])).toBeTruthy()
})

test("areTags", () => {
  expect(areTags(["e"])).toBeFalsy()
  expect(areTags([["e", hex32, ""]])).toBeTruthy()
})

test("appendTag", () => {
  const tags = [["p", hex32, "ws://example.com"]]
  const nextTags = appendTag(tags, ["p", hex32])
  expect(nextTags.length).toBe(2)
  expect(nextTags).not.toEqual(tags)
})