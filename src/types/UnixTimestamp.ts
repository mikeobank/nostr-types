import { isUInt } from "../lib/utils/isInt"
import { is } from "../lib/utils/is"

export type UnixTimestamp = number // unsigned int, Time in seconds since Unix Epoch

export const millisecondsToSeconds = (ms: number) : UnixTimestamp => Math.floor(ms / 1000)

export const isUnixTimestamp = (unixTimestamp: unknown, shouldWarn = false) : unixTimestamp is UnixTimestamp => {
  if (isUInt(unixTimestamp)) {
    if (shouldWarn && (unixTimestamp === 0 || unixTimestamp === 1)) console.warn("Unix timestamp equals 0 or 1. This might be a bug")
    return true
  }
  return false
}

export const createUnixTimestamp = (date: string) : UnixTimestamp | undefined => {
  const n = Date.parse(date)
  if (Number.isNaN(n)) return
  return millisecondsToSeconds(n)
}

export const now = () : UnixTimestamp => millisecondsToSeconds(Date.now())

export const isInBetween = (unixTimestamp: UnixTimestamp, lower: UnixTimestamp, upper?: UnixTimestamp) : boolean => {
  if (unixTimestamp < lower) return false
  if (is(upper) && unixTimestamp > upper) return false
  return true
}