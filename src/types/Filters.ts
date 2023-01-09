import { Id, IdPrefix, areIds, areIdPrefixes } from "./Id"
import { PublicKeyHex, PublicKeyHexPrefix, arePublicKeyHexes, arePublicKeyHexPrefixes } from "./PublicKey"
import { Kind, areKinds } from "./Kind"
import { isUnixTimestamp, UnixTimestamp } from "./UnixTimestamp"
import { Hex } from "./Hex"
import sha256 from "../lib/sha256"
import isArray from "../lib/utils/isArray"
import { is } from "../lib/utils/is"
import { isUInt } from "../lib/utils/isInt"
import isObject from "../lib/utils/isObject"

type Limit = number // Unsigned Int
const isLimit = (limit: unknown) : limit is Limit => isUInt(limit)

export type Filters = {
  ids?: IdPrefix[]
  authors?: PublicKeyHexPrefix[]
  kinds?: Kind[]
  "#e"?: Id[]
  "#p"?: PublicKeyHex[]
  since?: UnixTimestamp
  until?: UnixTimestamp
  limit?: Limit
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