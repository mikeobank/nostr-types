import { NostrEvent, parseEvent } from "./NostrEvent"
import { Filters, isFilters } from "./Filters"
import { isSubscriptionId, SubscriptionId } from "./SubscriptionId"
import { isArrayOfSize } from "../lib/utils/isSize"
import isString from "../lib/utils/isString"

export type ClientEventMessage = ["EVENT", NostrEvent]
export type ClientReqMessage = ["REQ", SubscriptionId, Filters]
export type ClientCloseMessage = ["CLOSE", SubscriptionId]
export type ClientAuthMessage = ["AUTH", NostrEvent]
export type ClientMessage = ClientEventMessage | ClientReqMessage | ClientCloseMessage | ClientAuthMessage

export const createClientEventMessage = (event: NostrEvent) : ClientEventMessage => ["EVENT", event]
export const createClientReqMessage = (subscriptionId: SubscriptionId, filters: Filters) : ClientReqMessage => ["REQ", subscriptionId, filters]
export const createClientCloseMessage = (subscriptionId: SubscriptionId) : ClientCloseMessage => ["CLOSE", subscriptionId]
export const createClientAuthMessage = (event: NostrEvent) : ClientAuthMessage => ["AUTH", event]

export const isClientEventMessage = (message: unknown, shouldParse = false) : message is ClientEventMessage => {
  if (isArrayOfSize(message, 2)) {
    if (message[0] === "EVENT") {
      if (shouldParse) {
        try {
          parseEvent(message[1])
          return true
        } catch (err) {
          return false
        }
      } else {
        return isString(message[1])
      }
    }
    return false
  }
  return false
}

export const isClientReqMessage = (message: unknown) : message is ClientReqMessage => {
  if (isArrayOfSize(message, 3)) {
    return message[0] === "REQ" && isSubscriptionId(message[1]) && isFilters(message[2])
  }
  return false
}

export const isClientCloseMessage = (message: unknown) : message is ClientCloseMessage => {
  if (isArrayOfSize(message, 2)) {
    return message[0] === "CLOSE" && isSubscriptionId(message[1])
  }
  return false
}

export const isClientAuthMessage = (message: unknown) : message is ClientAuthMessage => {
  if (isArrayOfSize(message, 2)) {
    if (message[0] === "AUTH") {
      try {
        parseEvent(message[1])
        return true
      } catch (err) {
        return false
      }
    }
    return false
  }
  return false
}