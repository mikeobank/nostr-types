import type { Filters } from "./Filters"
import sha256 from "../lib/sha256"
import isString from "../lib/utils/isString"
import { is } from "../lib/utils/is"
import { isNotEmpty } from "../lib/utils/isEmpty"
import { now } from "./UnixTimestamp"

export type SubscriptionId = string
export const isSubscriptionId = (subscriptionId: unknown) : subscriptionId is SubscriptionId => isString(subscriptionId) && isNotEmpty(subscriptionId)

export const createSubscriptionId = (filters?: Filters, maxLength = 64) : SubscriptionId => {
  const str = is(filters) ? JSON.stringify(filters) : now().toString()
  return sha256(str).substring(0, maxLength)
}
