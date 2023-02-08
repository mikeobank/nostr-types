import { isArrayOfSize } from "../lib/utils/isSize"
import isString from "../lib/utils/isString"
import isArray from "../lib/utils/isArray"

export type Tag = string[]
export type Tags = Tag[]

export const isTag = (tag: unknown) : tag is Tag => {
  return isArrayOfSize(tag, 2, true) && tag.every(isString)
}

export const areTags = (tags: unknown) : tags is Tags => {
  return isArray(tags) && tags.every(isTag)
}

export const appendTag = (tags: Tags, tag: Tag) => {
  return [...tags, tag]
}