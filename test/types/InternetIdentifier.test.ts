import { isDomain, isLocalPart, parseInternetIdentifier } from "../../src/types/InternetIdentifier"

test("isDomain", () => {
  expect(isDomain("https://example.com")).toBeFalsy()
  expect(isDomain("@example")).toBeFalsy()
  expect(isDomain("e.c")).toBeFalsy()
  expect(isDomain("example.com")).toBeTruthy()
  expect(isDomain("subdomain.example.com")).toBeTruthy()
  expect(isDomain("sub.subdomain.example.com")).toBeTruthy()
})

test("isLocalPart", () => {
  expect(isLocalPart("@example")).toBeFalsy()
  expect(isLocalPart("bob")).toBeTruthy()
  expect(isLocalPart("Bob")).toBeTruthy()
  expect(isLocalPart("first.lastname")).toBeTruthy()
})

test("parseInternetIdentifier", () => {
  expect(() => parseInternetIdentifier("example")).toThrow()
  expect(() => parseInternetIdentifier("@example.com")).toThrow()
  const result = parseInternetIdentifier("bob@example.com")
  expect(result.length).toBe(2)
  expect(result[0]).toBe("bob")
  expect(result[1]).toBe("example.com")
})