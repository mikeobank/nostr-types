import isArray from "./isArray"

export const isSize = <T>(value: T[], size: number, min = false) : boolean => {
  return min ? value.length >= size : value.length === size
}

export const isArrayOfSize = (value: unknown, size: number, min = false) : value is Array<unknown> => {
  return isArray(value) && isSize(value, size, min)
}
