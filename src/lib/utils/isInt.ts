import isNumber from "./isNumber"

export type Int = number
export type UInt = number

export const isInt = (value: unknown) : value is Int => isNumber(value) && Math.round(value) === value
export const isUInt = (value: unknown) : value is UInt => isInt(value) && value >= 0