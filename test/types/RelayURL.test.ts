import { createRelayURL, isRelayURL } from "../../src/types/RelayURL"

test("isRelayURL", () => {
  expect(isRelayURL("")).toBeFalsy()
  expect(isRelayURL("example.com")).toBeFalsy()
  expect(isRelayURL("https://example.com")).toBeFalsy()
  expect(isRelayURL("ws://example.com")).toBeTruthy()
  expect(isRelayURL("wss://example.com")).toBeTruthy()
  expect(isRelayURL("wss://sub.domain.example.com")).toBeTruthy()
  expect(isRelayURL("wss://example.com/path")).toBeTruthy()
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