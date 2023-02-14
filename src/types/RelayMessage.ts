import { isSubscriptionId, SubscriptionId } from "./SubscriptionId"
import { isEvent, isEventSync, NostrEvent } from "./NostrEvent"
import { Id, isId } from "./Id"
import { isArrayOfSize } from "../lib/utils/isSize"
import isString from "../lib/utils/isString"
import isBoolean from "../lib/utils/isBoolean"

type ChallengeString = string

export type RelayEventMessage = ["EVENT", SubscriptionId, NostrEvent]
export type RelayNoticeMessage = ["NOTICE", string]
export type RelayEOSEMessage = ["EOSE", SubscriptionId]
export type RelayOKMessage = ["OK", Id, boolean, string]
export type RelayAuthMessage = ["AUTH", ChallengeString]
export type RelayMessage = RelayEventMessage | RelayNoticeMessage | RelayEOSEMessage | RelayOKMessage | RelayAuthMessage

export const createRelayEventMessage = (subscriptionId: SubscriptionId, event: NostrEvent) : RelayEventMessage => ["EVENT", subscriptionId, event]
export const createRelayNoticeMessage = (message: string) : RelayNoticeMessage => ["NOTICE", message]
export const createRelayEOSEMessage = (subscriptionId: SubscriptionId) : RelayEOSEMessage => ["EOSE", subscriptionId]
export const createRelayOKMessage = (id: Id, result: boolean, message: string) : RelayOKMessage => ["OK", id, result, message]
export const createRelayAuthMessage = (challengeString: ChallengeString) : RelayAuthMessage => ["AUTH", challengeString]

export const isRelayEventMessage = async (message: unknown) : Promise<boolean> => {
  return isArrayOfSize(message, 3) && message[0] === "EVENT" && isSubscriptionId(message[1]) && await isEvent(message[2])
}

export const isRelayEventMessageSync = (message: unknown) : message is RelayEventMessage => {
  return isArrayOfSize(message, 3) && message[0] === "EVENT" && isSubscriptionId(message[1]) && isEventSync(message[2])
}

export const isRelayNoticeMessage = (message: unknown) : message is RelayNoticeMessage => {
  return isArrayOfSize(message, 2) && message[0] === "NOTICE" && isString(message[1])
}

export const isRelayEOSEMessage = (message: unknown) : message is RelayEOSEMessage => {
  return isArrayOfSize(message, 2) && message[0] === "EOSE" && isSubscriptionId(message[1])
}

export const isRelayOKMessage = (message: unknown) : message is RelayOKMessage => {
  return isArrayOfSize(message, 4) && message[0] === "OK" && isId(message[1]) && isBoolean(message[2]) && isString(message[3])
}

export const isRelayAuthMessage = async (message: unknown) : Promise<boolean> => {
  return isArrayOfSize(message, 2) && message[0] === "AUTH" && await isEvent(message[1])
}

export const isRelayAuthMessageSync = (message: unknown) : message is RelayAuthMessage => {
  return isArrayOfSize(message, 2) && message[0] === "AUTH" && isEventSync(message[1])
}
