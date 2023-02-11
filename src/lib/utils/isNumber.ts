export type Int = number
export type UInt = number
export type Byte = number

export const isNumber = (value: unknown) : value is number => typeof value === "number" && Number.isNaN(value) === false
export const isInt = (value: unknown) : value is Int => isNumber(value) && Math.round(value) === value
export const isUInt = (value: unknown) : value is UInt => isInt(value) && value >= 0
export const isByte = (value: unknown) : value is Byte => isUInt(value) && value <= 255
