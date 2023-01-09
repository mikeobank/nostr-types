import isArray from "./isArray"

export default (value: unknown) : value is Record<string, unknown> =>
  typeof value === 'object' && isArray(value) === false && value !== null