import isArray from "./isArray"
import isObject from "./isObject"
import isString from "./isString"

export const isEmpty = <T>(value: string | T[] | Record<string, unknown>) : boolean => {
  if (isString(value)) return value === ""
  if (isArray(value)) return value.length === 0
  if (isObject(value)) return Object.keys(value).length === 0
  // this should be unreachable
  throw new Error("Invalid type for value param")
}

export const isNotEmpty = <T>(value: string | T[] | Record<string, unknown>) : boolean => isEmpty(value) === false