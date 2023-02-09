import { isFilters, parseFilters } from "../../src/types/Filters"
import hex32 from "../hex32"

test("isFilters", () => {
  expect(isFilters([])).toBeFalsy()
  expect(isFilters({})).toBeTruthy()
  expect(isFilters({ ids: ["a", "1"] })).toBeTruthy()
  expect(isFilters({ additional: "String" })).toBeTruthy()
})

test("parseFilters", () => {
  expect(parseFilters({ key: [] })).toEqual({})
  expect(() => parseFilters({ ids: "f" })).toThrow()
  expect(() => parseFilters({ ids: ["g"] })).toThrow()
  expect(() => parseFilters({ ids: ["f"] })).not.toThrow()
  expect(() => parseFilters({ authors: "f" })).toThrow()
  expect(() => parseFilters({ authors: ["g"] })).toThrow()
  expect(() => parseFilters({ authors: ["f"] })).not.toThrow()
  expect(() => parseFilters({ kinds: 1 })).toThrow()
  expect(() => parseFilters({ kinds: ["a"] })).toThrow()
  expect(() => parseFilters({ kinds: [0] })).not.toThrow()
  expect(() => parseFilters({ "#e": hex32 })).toThrow()
  expect(() => parseFilters({ "#e": ["a"] })).toThrow()
  expect(() => parseFilters({ "#e": [hex32] })).not.toThrow()
  expect(() => parseFilters({ "#p": hex32 })).toThrow()
  expect(() => parseFilters({ "#p": ["a"] })).toThrow()
  expect(() => parseFilters({ "#p": [hex32] })).not.toThrow()
  expect(() => parseFilters({ since: new Date() })).toThrow()
  expect(() => parseFilters({ since: 3 })).not.toThrow()
  expect(() => parseFilters({ until: new Date() })).toThrow()
  expect(() => parseFilters({ until: 4 })).not.toThrow()
  expect(() => parseFilters({ limit: [] })).toThrow()
  expect(() => parseFilters({ limit: -1 })).toThrow()
  expect(() => parseFilters({ limit: 128 })).not.toThrow()
  expect(() => parseFilters({ limit: 0 })).not.toThrow()
  expect(() => parseFilters({ "#g": [1] })).toThrow()
  expect(() => parseFilters({ "#g": ["57.64911,10.40744"] })).not.toThrow()
  expect(() => parseFilters({ "#r": ["example.com"] })).not.toThrow()
  expect(() => parseFilters({ "#t": ["#hashtag"] })).not.toThrow()

  const filters = { authors: [hex32], "#r": ["example.com"] }
  expect(parseFilters(filters)).toEqual(filters)
})