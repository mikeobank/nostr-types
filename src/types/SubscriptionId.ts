import { isNotEmpty } from "../lib/utils/isEmpty"
import isString from "../lib/utils/isString"

export type SubscriptionId = string
export const isSubscriptionId = (subscriptionId: unknown) : subscriptionId is SubscriptionId => isString(subscriptionId) && isNotEmpty(subscriptionId)

