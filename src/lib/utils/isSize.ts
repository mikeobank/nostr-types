import isArray from "./isArray.js"

export const isSize = <T>(arr: T[], size: number, min = false) : boolean => {
  return min ? arr.length >= size : arr.length === size
}

export const isArrayOfSize = (arr: unknown, size: number, min = false) : arr is Array<unknown> => {
  return isArray(arr) && isSize(arr, size, min)
}
