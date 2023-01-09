import { isContent } from "../../src/types/Content"

test("content", async () => {
  expect(isContent("")).toBeTruthy()
  expect(isContent("a")).toBeTruthy()
  expect(isContent({ "a": "A" })).toBeFalsy()
})