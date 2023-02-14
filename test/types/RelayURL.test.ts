import { createRelayURL, isRelayURL, areRelayURLs } from "../../src/types/RelayURL"

test("isRelayURL", () => {
  expect(isRelayURL(3)).toBeFalsy()
  expect(isRelayURL("")).toBeFalsy()
  expect(isRelayURL("example.com")).toBeFalsy()
  expect(isRelayURL("https://example.com")).toBeFalsy()
  expect(isRelayURL("ws://example.com")).toBeTruthy()
  expect(isRelayURL("wss://example.com")).toBeTruthy()
  expect(isRelayURL("wss://sub.domain.example.com")).toBeTruthy()
  expect(isRelayURL("wss://example.com/path")).toBeTruthy()
})

test("areRelayURLs", () => {
  expect(areRelayURLs("ws://example.com")).toBeFalsy()
  expect(areRelayURLs(["ws://example.com", "wss://sub.domain.example.com"])).toBeTruthy()
})

test("createRelayURL", () => {
  const relayURL = createRelayURL("example.com", "path")
  expect(relayURL).toBe("wss://example.com/path")
  expect(isRelayURL(relayURL)).toBeTruthy()
})

test("createRelayURL with included path", () => {
  const relayURL = createRelayURL("example.com/path")
  expect(relayURL).toBe("wss://example.com/path")
  expect(isRelayURL(relayURL)).toBeTruthy()
})

test("createRelayURL with slashes", () => {
  const relayURL = createRelayURL("example.com/", "/path/")
  expect(relayURL).toBe("wss://example.com/path")
  expect(isRelayURL(relayURL)).toBeTruthy()
})