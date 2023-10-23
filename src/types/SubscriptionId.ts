import type { Filters } from "./Filters.js"
import sha256 from "../lib/sha256.js"
import isString from "../lib/utils/isString.js"
import { is } from "../lib/utils/is.js"
import { isNotEmpty } from "../lib/utils/isEmpty.js"
import { now } from "./UnixTimestamp.js"

export type SubscriptionId = string
export const isSubscriptionId = (subscriptionId: unknown) : subscriptionId is SubscriptionId => isString(subscriptionId) && isNotEmpty(subscriptionId)

export const createSubscriptionId = (filters?: Filters, maxLength = 64) : SubscriptionId => {
  const str = is(filters) ? JSON.stringify(filters) : now().toString()
  return sha256(str).substring(0, maxLength)
}
