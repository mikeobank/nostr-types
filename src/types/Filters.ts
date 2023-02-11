import { IdPrefix, areIds, areIdPrefixes } from "./Id"
import { PublicKeyHexPrefix, arePublicKeyHexes, arePublicKeyHexPrefixes } from "./PublicKey"
import { Kind, areKinds } from "./Kind"
import { isUnixTimestamp, UnixTimestamp } from "./UnixTimestamp"
import { Hex } from "./Hex"
import sha256 from "../lib/sha256"
import isArray from "../lib/utils/isArray"
import { is } from "../lib/utils/is"
import { UInt, isUInt } from "../lib/utils/isNumber"
import isObject from "../lib/utils/isObject"
import { isNotEmpty } from "../lib/utils/isEmpty"
import isString from "../lib/utils/isString"
import isIn from "../lib/utils/isIn"

type Limit = UInt
const isLimit = (limit: unknown) : limit is Limit => isUInt(limit)

type GenericTag = `#${ string }`
const nonGenericTags = ["#e", "#p"]
export type Filters = {
  ids?: IdPrefix[]
  authors?: PublicKeyHexPrefix[]
  kinds?: Kind[]
  since?: UnixTimestamp
  until?: UnixTimestamp
  limit?: Limit
  search?: string
  [genericTag: GenericTag]: string[]
}


const genericTags = (filters: Record<string, unknown>) : GenericTag[] => {
  const isGenericTag = (key: string) : key is GenericTag => /^#[a-z]$/.test(key)
  const keys = Object.keys(filters)
  return keys.filter(isGenericTag).filter(key => isIn(nonGenericTags, key) === false)
}

export const hashFilters = (filters: Filters) : Hex => {
  return sha256(JSON.stringify(filters))
}

export const parseFilters = (value: unknown) : Filters => {
  const filters: Filters = {}
  if (isObject(value)) {
    if (is(value.ids)) {
      if (isArray(value.ids)) {
        if (areIdPrefixes(value.ids)) {
          filters.ids = value.ids
        } else {
          throw new Error(`${ value.ids } includes an invalid id prefix`)
        }
      } else {
        throw new Error(`${ value.ids } is not an array`)
      }
    }
    if (is(value.authors)) {
      if (isArray(value.authors)) {
        if (arePublicKeyHexPrefixes(value.authors)) {
          filters.authors = value.authors
        } else {
          throw new Error(`${ value.authors } includes an invalid public key prefix`)
        }
      } else {
        throw new Error(`${ value.authors } includes an invalid id prefix`)
      }
    }
    if (is(value.kinds)) {
      if (isArray(value.kinds)) {
        if (areKinds(value.kinds)) {
          filters.kinds = value.kinds
        } else {
          throw new Error(`${ value.kinds } includes an invalid kind`)
        }
      } else {
        throw new Error(`${ value.kinds } is not an array`)
      }
    }
    if (is(value["#e"])) {
      if (isArray(value["#e"])) {
        if (areIds(value["#e"])) {
          filters["#e"] = value["#e"]
        } else {
          throw new Error(`${ value["#e"] } includes an invalid id`)
        }
      } else {
        throw new Error(`${ value["#e"] } is not an array`)
      }
    }
    if (is(value["#p"])) {
      if (isArray(value["#p"])) {
        if (arePublicKeyHexes(value["#p"])) {
          filters["#p"] = value["#p"]
        } else {
          throw new Error(`${ value["#p"] } includes an invalid public key`)
        }
      } else {
        throw new Error(`${ value["#p"] } is not an array`)
      }
    }
    if (is(value.since)) {
      if (isUnixTimestamp(value.since)) {
        filters.since = value.since
      } else {
        throw new Error(`${ value.since } is not a valid Unix timestamp`)
      }
    }
    if (is(value.until)) {
      if (isUnixTimestamp(value.until)) {
        filters.until = value.until
      } else {
        throw new Error(`${ value.until } is not a valid Unix timestamp`)
      }
    }
    if (is(value.limit)) {
      if (isLimit(value.limit)) {
        filters.limit = value.limit
      } else {
        throw new Error(`${ value.limit } is not a valid number`)
      }
    }
    if (is(value.search)) {
      if (isString(value.search)) {
        filters.search = value.search
      } else {
        throw new Error(`${ value.search } is not a valid string`)
      }
    }
    const tags = genericTags(value)
    if (isNotEmpty(tags)) {
      tags.forEach(tag => {
        const tagValues = value[tag]
        if (isArray(tagValues) && tagValues.every(isString)) {
          filters[tag] = tagValues
        } else {
          throw new Error(`${ tagValues } contains a non string value`)
        }
      })
    }
  } else {
    throw new Error(`${ value } is not an object`)
  }
  return filters
}

export const isFilters = (filters: unknown, shouldLogErrors = false) : filters is Filters => {
  try {
    parseFilters(filters)
    return true
  } catch (err) {
    if (shouldLogErrors) console.error(err)
    return false
  }
}