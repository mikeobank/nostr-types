export const is = <T>(value: T | undefined | null) : value is T => value != null
export const isNot = <T>(value: unknown) : value is undefined | null => is(value) === false