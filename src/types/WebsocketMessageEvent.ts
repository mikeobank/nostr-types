import isArray from "../lib/utils/isArray.js"

export const tryParseMessageEventData = (data: string) : unknown[] | undefined => {
  try {
    const json = JSON.parse(data)
    if (isArray(json)) {
      return json
    } else {
      throw new Error("event data is not an array")
    }
  } catch (err) {
    return undefined
  }
}