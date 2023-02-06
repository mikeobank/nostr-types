import { isBase64 } from "../../src/types/Base64"

test("isBase64", () => {
  expect(isBase64(undefined)).toBeFalsy()
  expect(isBase64("a")).toBeFalsy()
  expect(isBase64("")).toBeFalsy()
  expect(isBase64("Tm9zdHI=")).toBeTruthy()
})