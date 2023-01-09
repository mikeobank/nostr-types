import { isHex, isHexOfLength } from "../../src/types/Hex"

test("isHex", () => {
  expect(isHex("09af")).toBeTruthy()
  expect(isHex("09AF")).toBeFalsy()
  expect(isHex("G")).toBeFalsy()
})

test("isHexOfLength", () => {
  expect(() => isHexOfLength("09af", 4, 3)).toThrow()
  expect(isHexOfLength("09af", 4)).toBeTruthy()
  expect(isHexOfLength("09af", 3, 5)).toBeTruthy()
  expect(isHexOfLength("30450221009d92954d329998340f734650efe037879687ddc516dd5e640473fbbcad3207f7022049ccbb79ff8b32ffb4d2cdb8419df2be75ced3667af25e81ff442c2c1b4f2d2a", 140, 142)).toBeTruthy()
})