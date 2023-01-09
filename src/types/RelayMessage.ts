import { isSubscriptionId, SubscriptionId } from "./SubscriptionId"
import { isEvent, NostrEvent } from "./NostrEvent"
import isString from "../lib/utils/isString"
import { isArrayOfSize } from "../lib/utils/isSize"

export type RelayEventMessage = ["EVENT", SubscriptionId, NostrEvent]
export type RelayNoticeMessage = ["NOTICE", string]
export type RelayMessage = RelayEventMessage | RelayNoticeMessage

export const createRelayEventMessage = (subscriptionId: SubscriptionId, event: NostrEvent) : RelayEventMessage => ["EVENT", subscriptionId, event]
export const createRelayNoticeMessage = (message: string) : RelayNoticeMessage => ["NOTICE", message]

export const isRelayEventMessage = async (message: unknown) : Promise<boolean> => {
  return isArrayOfSize(message, 3) && message[0] === "EVENT" && isSubscriptionId(message[1]) && await isEvent(message[2])
}

export const isRelayNoticeMessage = (message: unknown) : message is RelayEventMessage => {
  return isArrayOfSize(message, 2) && message[0] === "NOTICE" && isString(message[1])
}
