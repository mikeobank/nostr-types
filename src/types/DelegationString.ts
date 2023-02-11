import { Kind } from "./Kind"
import { isPublicKeyHex, PublicKeyHex } from "./PublicKey"
import { UnixTimestamp } from "./UnixTimestamp"
import { is } from "../lib/utils/is"
import { isUInt } from "../lib/utils/isInt"
import { isArrayOfSize } from "../lib/utils/isSize"
import isString from "../lib/utils/isString"

type ConditionsQueryString = string
type DelegationString = `nostr:delegation:${ PublicKeyHex }:${ ConditionsQueryString }`
const conditionNames = ["kind", "created_at"]
type ConditionName = typeof conditionNames[number]
const compareChars = ["=", "<", ">"]
type CompareChar = typeof compareChars[number]
type Condition = [ConditionName, Kind | UnixTimestamp, CompareChar]
type Conditions = Condition[]
const separator = "&"

const conditionToString = (condition: Condition) : string => {
  const [name, value, compareChar] = condition
  return `${ name }${ compareChar }${ value }`
}

const createConditionsQueryString = (kinds: Kind[], before?: UnixTimestamp, after?: UnixTimestamp) : ConditionsQueryString => {
  const conditions: Conditions = kinds.map(kind => ["kind", kind, "="])
  if (is(before)) conditions.push(["created_at", before, "<"])
  if (is(after)) conditions.push(["created_at", after, ">"])
  return conditions.map(conditionToString).join(separator)
}

const parseCondition = (str: string) : Condition => {
  const regex = new RegExp(`^(${ conditionNames.join("|") })([${ compareChars.join("") }])([0-9]+)$`)
  const match = str.match(regex)
  if (is(match)) {
    const [, name, compareChar, d] = match
    const uint = parseInt(d, 10)
    if (isUInt(uint)) {
      if (name === "kind" && compareChar === "=") return [name, uint, compareChar]
      if (name === "created_at" && ["<", ">"].includes(compareChar)) return [name, uint, compareChar]
    }
  }
  throw new Error(`${ str } is not formatted as a correct condition`)
}

const parseConditionsQueryString = (str: string) : Conditions => {
  return str.split(separator).map(parseCondition)
}

export const createDelegationString = (publicKey: PublicKeyHex, kinds: Kind[] = [], before?: UnixTimestamp, after?: UnixTimestamp) : DelegationString => {
  return `nostr:delegation:${ publicKey }:${ createConditionsQueryString(kinds, before, after) }`
}

export const parseDelegationString = (str: unknown) : [PublicKeyHex, Conditions]=> {
  if (isString(str)) {
    const parts = str.split(":")
    if (isArrayOfSize(parts, 4)) {
      const [nostr, delegation, publicKey, conditionString] = parts
      if (nostr === "nostr" && delegation === "delegation") {
        if (isPublicKeyHex(publicKey)) {
          const conditions = parseConditionsQueryString(conditionString)
          return [publicKey, conditions]
        }
      }
    }
    throw new Error(`${ str } is not formatted as "nostr:delegation:<Public Key (hex)>:<Condition String>`)
  }
  throw new Error(`${ str } is not a String`)
}

export const isDelegationString = (delegationString: unknown) : delegationString is DelegationString => {
  try {
    parseDelegationString(delegationString)
    return true
  } catch (err) {
    return false
  }
}