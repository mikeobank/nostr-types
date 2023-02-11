import { createDelegationString, isDelegationString, parseDelegationString } from "../../src/types/DelegationString"
import hex32 from "../hex32"

test("createDelegationString", () => {
  expect(createDelegationString(hex32, [1])).toBe("nostr:delegation:012345678901234567890123456789012345678901234567890123456789abcd:kind=1")
  expect(createDelegationString(hex32, [1, 5])).toBe("nostr:delegation:012345678901234567890123456789012345678901234567890123456789abcd:kind=1&kind=5")
  expect(createDelegationString(hex32, [1], 1673726256)).toBe(
    "nostr:delegation:012345678901234567890123456789012345678901234567890123456789abcd:kind=1&created_at<1673726256"
  )
  expect(createDelegationString(hex32, [1], 1673726256, 1073726256)).toBe(
    "nostr:delegation:012345678901234567890123456789012345678901234567890123456789abcd:kind=1&created_at<1673726256&created_at>1073726256"
  )
})

test("parseDelegationString", () => {
  expect(() => parseDelegationString("nost:delegation:012345678901234567890123456789012345678901234567890123456789abcd:kind=1")).toThrow()
  expect(() => parseDelegationString("nostr:delegate:012345678901234567890123456789012345678901234567890123456789abcd:kind=1")).toThrow()
  expect(() => parseDelegationString("nostr:delegation:012345678901234567890123456789012345678901234567890123456789abc:kind=1")).toThrow()
  expect(() => parseDelegationString(
    "nostr:delegation:012345678901234567890123456789012345678901234567890123456789abcd:kind=1&created_at<1673726256&created_at>1073726256"
  )).not.toThrow()
  expect(() => parseDelegationString("nostr:delegation:012345678901234567890123456789012345678901234567890123456789abcd:kind>1")).toThrow()
  expect(() => parseDelegationString("nostr:delegation:012345678901234567890123456789012345678901234567890123456789abcd:created_at=1073726256")).toThrow()
  expect(parseDelegationString(
    "nostr:delegation:012345678901234567890123456789012345678901234567890123456789abcd:kind=1&created_at<1673726256&created_at>1073726256"
  )).toEqual(["012345678901234567890123456789012345678901234567890123456789abcd", [["kind", 1, "="], ["created_at", 1673726256, "<"], ["created_at", 1073726256, ">"]]])
})

test("isDelegationString", () => {
  expect(isDelegationString("nostr:delegation:012345678901234567890123456789012345678901234567890123456789abcd")).toBeFalsy()
  expect(isDelegationString("nostr:delegation:012345678901234567890123456789012345678901234567890123456789abcd:kind=1&created_at<1673726256&created_at>1073726256")).toBeTruthy()
})