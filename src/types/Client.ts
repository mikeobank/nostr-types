import type { Filters } from "./Filters"
import type { RelayURL } from "./RelayURL"
import { NostrEvent, parseEvent } from "./NostrEvent"

import { ClientMessage, createClientCloseMessage, createClientEventMessage, createClientReqMessage } from "./ClientMessage"
import { SubscriptionId, createSubscriptionId } from "./SubscriptionId"
import { isRelayEventMessage, isRelayNoticeMessage, isRelayEOSEMessage } from "./RelayMessage"
import { isNotEmpty } from "../lib/utils/isEmpty"
import WebSocket from "../lib/websocket"

type Callbacks = {
  onOpen?: (event: Event) => void
  onError?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onMessage?: (event: MessageEvent) => void
}

export type Client = {
  sendEvent: (event: NostrEvent) => void
  sendReq: (filters: Filters, subscriptionId?: SubscriptionId, overwrite?: boolean) => void
  sendClose: (subscriptionId: SubscriptionId) => void
}

const maxLengthSubscriptionId = 8

const onOpen = (event: Event) => {
  console.log("open", event)
}

const onError = (event: Event) => {
  console.log("error", event)
}

const onClose = (event: CloseEvent) => {
  console.log("close", event)
}

const onMessage = async (event: MessageEvent) => {
  const data = event.data
  if (await isRelayEventMessage(data)) {
    try {
      const nostrEvent = await parseEvent(data[2])
      if (isNotEmpty(nostrEvent)) {
        console.log("EVENT: ", data[1], nostrEvent)
      }
    } catch (err) {
      console.error(err)
    }
  } else if (isRelayNoticeMessage(data)) {
    console.log("NOTICE: ", data[1])
  } else if (isRelayEOSEMessage(data)) {
    console.log("EOSE: ", data[1])
  } else {
    console.log("NON NOSTR EVENT: ", event)
  }
}

export const createClient = (url: RelayURL, callbacks: Callbacks = {}, requestOnOpen?: Filters, shouldLog = false) : Client => {

  const webSocket = new WebSocket(url)

  webSocket.onopen = (event: Event) => {
    if (shouldLog) onOpen(event)
    if (callbacks.onOpen !== undefined) callbacks.onOpen(event)
    if (requestOnOpen !== undefined) sendReq(requestOnOpen)
  }
  webSocket.onerror = (event: Event) => {
    if (shouldLog) onError(event)
    if (callbacks.onError !== undefined) callbacks.onError(event)
  }
  webSocket.onclose = (event: CloseEvent) => {
    if (shouldLog) onClose(event)
    if (callbacks.onClose !== undefined) callbacks.onClose(event)
  }
  webSocket.onmessage = (event: MessageEvent) => {
    if (shouldLog) onMessage(event)
    if (callbacks.onMessage !== undefined) callbacks.onMessage(event)
  }

  const subscriptions: Record<SubscriptionId, Filters> = {}
  const getSubscription = (id: SubscriptionId) => subscriptions[id]
  const hasSubscription = (id: SubscriptionId) => getSubscription(id) !== undefined
  const addSubscription = (id: SubscriptionId, filters: Filters) => subscriptions[id] = filters
  const removeSubscription = (id: SubscriptionId) => delete subscriptions[id]

  const send = (message: ClientMessage) => {
    webSocket.send(JSON.stringify(message))
  }

  const sendEvent = (event: NostrEvent) => {
    send(createClientEventMessage(event))
  }

  const sendReq = (filters: Filters, subscriptionId: SubscriptionId = createSubscriptionId(filters, maxLengthSubscriptionId), overwrite = false) => {
    // guard against duplicate filters
    if (overwrite === false && hasSubscription(subscriptionId)) return
    addSubscription(subscriptionId, filters)
    send(createClientReqMessage(subscriptionId, filters))
  }

  const sendClose = (subscriptionId: SubscriptionId) => {
    if (hasSubscription(subscriptionId) === false) return
    send(createClientCloseMessage(subscriptionId))
    removeSubscription(subscriptionId)
  }

  return {
    sendEvent,
    sendReq,
    sendClose
  }
}
