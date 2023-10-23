import { isSubscriptionId, SubscriptionId } from "./SubscriptionId.js"
import { isEvent, isEventSync, NostrEvent } from "./NostrEvent.js"
import { Id, isId } from "./Id.js"
import { isArrayOfSize } from "../lib/utils/isSize.js"
import isString from "../lib/utils/isString.js"
import isBoolean from "../lib/utils/isBoolean.js"

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

export const isRelayEventMessage = async (messageData: unknown) : Promise<boolean> => {
  return isArrayOfSize(messageData, 3) && messageData[0] === "EVENT" && isSubscriptionId(messageData[1]) && await isEvent(messageData[2])
}

export const isRelayEventMessageSync = (messageData: unknown) : messageData is RelayEventMessage => {
  return isArrayOfSize(messageData, 3) && messageData[0] === "EVENT" && isSubscriptionId(messageData[1]) && isEventSync(messageData[2])
}

export const isRelayNoticeMessage = (messageData: unknown) : messageData is RelayNoticeMessage => {
  return isArrayOfSize(messageData, 2) && messageData[0] === "NOTICE" && isString(messageData[1])
}

export const isRelayEOSEMessage = (messageData: unknown) : messageData is RelayEOSEMessage => {
  return isArrayOfSize(messageData, 2) && messageData[0] === "EOSE" && isSubscriptionId(messageData[1])
}

export const isRelayOKMessage = (messageData: unknown) : messageData is RelayOKMessage => {
  return isArrayOfSize(messageData, 4) && messageData[0] === "OK" && isId(messageData[1]) && isBoolean(messageData[2]) && isString(messageData[3])
}

export const isRelayAuthMessage = (messageData: unknown) : messageData is RelayAuthMessage => {
  return isArrayOfSize(messageData, 2) && messageData[0] === "AUTH" && isString(messageData[1])
}
