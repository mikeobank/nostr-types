import isArray from "./isArray.js"

export default (value: unknown) : value is Record<string, unknown> =>
  typeof value === 'object' && isArray(value) === false && value !== null