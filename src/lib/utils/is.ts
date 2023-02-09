export const is = <T>(value: T | undefined | null) : value is T => value != null
export const isNot = (value: unknown) : value is undefined | null => is(value) === false