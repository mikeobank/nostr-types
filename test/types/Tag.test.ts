import { isTag, areTags, appendTag, isSpecificTag, isSpecificTagName, isETag, isPTag, isNonceTag, isSubjectTag, isDelegationTag, isDTag, isContentWarningTag, isExpirationTag, isRelayTag, isChallengeTag, isRTag } from "../../src/types/Tag"
import hex32 from "../hex32"
import hex64 from "../hex64"

test("isTag", () => {
  expect(isTag([""])).toBeFalsy()
  expect(isTag(["content-warning"])).toBeTruthy()
  expect(isTag(["e", hex32, ""])).toBeTruthy()
  expect(isTag(["custom", hex32, "ws://example.com"])).toBeTruthy()
  expect(isTag(["p", hex32, "ws://example.com", "pet name"])).toBeTruthy()
})

test("areTags", () => {
  expect(areTags(["tagName"])).toBeFalsy()
  expect(areTags([[""]])).toBeFalsy()
  expect(areTags([["content-warning"]])).toBeTruthy()
  expect(areTags([["e", hex32, ""]])).toBeTruthy()
})

test("appendTag", () => {
  const tags = [["p", hex32, "ws://example.com"]]
  const nextTags = appendTag(tags, ["p", hex32])
  expect(nextTags.length).toBe(2)
  expect(nextTags).not.toEqual(tags)
})

test("isSpecificTagName", () => {
  expect(isSpecificTagName("not known")).toBeFalsy()
  expect(isSpecificTagName("e")).toBeTruthy()
})

test("isETag", () => {
  expect(isETag(["e", ""])).toBeFalsy()
  expect(isETag(["e", "a"])).toBeFalsy()
  expect(isETag(["e", hex32, "a"])).toBeFalsy()
  expect(isETag(["e", hex32, "wss://example.com"])).toBeTruthy()
  expect(isETag(["e", hex32, ""])).toBeTruthy()
  expect(isETag(["e", hex32, "wss://example.com", "non marker"])).toBeFalsy()
  expect(isETag(["e", hex32, "wss://example.com", "reply"])).toBeTruthy()
  expect(isETag(["e", hex32, "nudity"])).toBeTruthy()
})

test("isPTag", () => {
  expect(isPTag(["p", ""])).toBeFalsy()
  expect(isPTag(["p", "a"])).toBeFalsy()
  expect(isPTag(["p", hex32, "a"])).toBeFalsy()
  expect(isPTag(["p", hex32, "wss://example.com"])).toBeTruthy()
  expect(isPTag(["p", hex32, "wss://example.com", "pet name"])).toBeTruthy()
  expect(isPTag(["p", hex32, "nudity"])).toBeTruthy()
})

test("isNonceTag", () => {
  expect(isNonceTag(["nonce", "16"])).toBeFalsy()
  expect(isNonceTag(["nonce", "16", "32"])).toBeTruthy()
})

test("isSubjectTag", () => {
  expect(isSubjectTag(["subject"])).toBeFalsy()
  expect(isSubjectTag(["subject", "subject"])).toBeTruthy()
})

test("isDelegationTag", () => {
  expect(isDelegationTag(["delegation"])).toBeFalsy()
  expect(isDelegationTag(["delegation", "", "kind=1", hex64])).toBeFalsy()
  expect(isDelegationTag(["delegation", hex32, "", hex64])).toBeFalsy()
  expect(isDelegationTag(["delegation", hex32, "kind=1", hex64])).toBeTruthy()
})

test("isDTag", () => {
  expect(isDTag(["d"])).toBeFalsy()
  expect(isDTag(["d", "test"])).toBeTruthy()
})

test("isContentWarningTag", () => {
  expect(isContentWarningTag(["content-warning"])).toBeTruthy()
  expect(isContentWarningTag(["content-warning", "message"])).toBeTruthy()
})

test("isExpirationTag", () => {
  expect(isExpirationTag(["expiration", ""])).toBeFalsy()
  expect(isExpirationTag(["expiration", "1673726256"])).toBeTruthy()
})

test("isRelayTag", () => {
  expect(isRelayTag(["relay", ""])).toBeFalsy()
  expect(isRelayTag(["relay", "wss://example.com"])).toBeTruthy()
})

test("isChallengeTag", () => {
  expect(isChallengeTag(["challenge"])).toBeFalsy()
  expect(isChallengeTag(["challenge", "challenge string"])).toBeTruthy()
})

test("isRTag", () => {
  expect(isRTag(["r", ""])).toBeFalsy()
  expect(isRTag(["r", "wss://example.com"])).toBeTruthy()
  expect(isRTag(["r", "wss://example.com", "string"])).toBeFalsy()
  expect(isRTag(["r", "wss://example.com", "write"])).toBeTruthy()
})

test("isSpecificTag", () => {
  expect(isSpecificTag(["p", hex32, "wss://example.com", "pet name"])).toBeTruthy()
  expect(isSpecificTag(["content-warning", "message"])).toBeTruthy()
})