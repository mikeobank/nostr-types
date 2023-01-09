import isString from "../lib/utils/isString"

export type Content = string

export const isContent = (content: unknown) : content is Content => {
  return isString(content)
}