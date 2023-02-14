import { NostrEvent, parseEvent, parseEventSync } from "./NostrEvent"
import { Filters, isFilters } from "./Filters"
import { isSubscriptionId, SubscriptionId } from "./SubscriptionId"
import { isArrayOfSize } from "../lib/utils/isSize"

export type ClientEventMessage = ["EVENT", NostrEvent]
export type ClientReqMessage = ["REQ", SubscriptionId, Filters]
export type ClientCloseMessage = ["CLOSE", SubscriptionId]
export type ClientAuthMessage = ["AUTH", NostrEvent]
export type ClientMessage = ClientEventMessage | ClientReqMessage | ClientCloseMessage | ClientAuthMessage

export const createClientEventMessage = (event: NostrEvent) : ClientEventMessage => ["EVENT", event]
export const createClientReqMessage = (subscriptionId: SubscriptionId, filters: Filters) : ClientReqMessage => ["REQ", subscriptionId, filters]
export const createClientCloseMessage = (subscriptionId: SubscriptionId) : ClientCloseMessage => ["CLOSE", subscriptionId]
export const createClientAuthMessage = (event: NostrEvent) : ClientAuthMessage => ["AUTH", event]

export const isClientEventMessage = async (message: unknown) : Promise<boolean> => {
  if (isArrayOfSize(message, 2)) {
    if (message[0] === "EVENT") {
      try {
        await parseEvent(message[1])
        return true
      } catch (err) {
        return false
      }
    }
    return false
  }
  return false
}

export const isClientEventMessageSync = (message: unknown) : message is ClientEventMessage => {
  if (isArrayOfSize(message, 2)) {
    if (message[0] === "EVENT") {
      try {
        parseEventSync(message[1])
        return true
      } catch (err) {
        return false
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

export const isClientAuthMessage = async (message: unknown) : Promise<boolean> => {
  if (isArrayOfSize(message, 2)) {
    if (message[0] === "AUTH") {
      try {
        await parseEvent(message[1])
        return true
      } catch (err) {
        return false
      }
    }
    return false
  }
  return false
}

export const isClientAuthMessageSync = (message: unknown) : message is ClientAuthMessage => {
  if (isArrayOfSize(message, 2)) {
    if (message[0] === "AUTH") {
      try {
        parseEventSync(message[1])
        return true
      } catch (err) {
        return false
      }
    }
    return false
  }
  return false
}