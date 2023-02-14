import type { Filters } from "./Filters"
import type { RelayURL } from "./RelayURL"
import { NostrEvent, parseEvent } from "./NostrEvent"

import { ClientMessage, createClientAuthMessage, createClientCloseMessage, createClientEventMessage, createClientReqMessage } from "./ClientMessage"
import { SubscriptionId, createSubscriptionId } from "./SubscriptionId"
import { isRelayEventMessage, isRelayNoticeMessage, isRelayEOSEMessage, RelayEventMessage, RelayNoticeMessage, RelayEOSEMessage, RelayOKMessage, RelayAuthMessage, isRelayAuthMessage, isRelayOKMessage } from "./RelayMessage"
import WebSocket from "../lib/websocket"
import { is } from "../lib/utils/is"

type Callbacks = {
  onOpen?: (event: Event) => void
  onError?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onMessage?: (event: MessageEvent) => void
  onEventMessage?: (event: RelayEventMessage) => void
  onNoticeMessage?: (event: RelayNoticeMessage) => void
  onEOSEMessage?: (event: RelayEOSEMessage) => void
  onOKMessage?: (event: RelayOKMessage) => void
  onAuthMessage?: (event: RelayAuthMessage) => void
}

export type Client = {
  sendEvent: (event: NostrEvent) => void
  sendReq: (filters: Filters, subscriptionId?: SubscriptionId, overwrite?: boolean) => void
  sendClose: (subscriptionId: SubscriptionId) => void
  sendAuth: (event: NostrEvent) => void
}

const maxLengthSubscriptionId = 16

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
  const { data } = event
  if (await isRelayEventMessage(data)) {
    try {
      const nostrEvent = await parseEvent(data[2])
      console.log("EVENT: ", data[1], nostrEvent)
    } catch (err) {
      console.error(err)
    }
  } else if (isRelayNoticeMessage(data)) {
    console.log("NOTICE: ", data[1])
  } else if (isRelayEOSEMessage(data)) {
    console.log("EOSE: ", data[1])
  } else if (isRelayOKMessage(data)) {
    console.log("OK: ", data[1], data[2], data[3])
  } else if (await isRelayAuthMessage(data)) {
    try {
      const nostrEvent = await parseEvent(data[2])
      console.log("AUTH: ", nostrEvent)
    } catch (err) {
      console.error(err)
    }
  } else {
    console.log("NON NOSTR EVENT: ", event)
  }
}

export const createClient = (url: RelayURL, callbacks: Callbacks = {}, requestOnOpen?: Filters, shouldLog = false) : Client => {

  const webSocket = new WebSocket(url)

  webSocket.onopen = (event: Event) => {
    if (shouldLog) onOpen(event)
    if (is(callbacks.onOpen)) callbacks.onOpen(event)
    if (is(requestOnOpen)) sendReq(requestOnOpen)
  }
  webSocket.onerror = (event: Event) => {
    if (shouldLog) onError(event)
    if (is(callbacks.onError)) callbacks.onError(event)
  }
  webSocket.onclose = (event: CloseEvent) => {
    if (shouldLog) onClose(event)
    if (is(callbacks.onClose)) callbacks.onClose(event)
  }
  webSocket.onmessage = async (event: MessageEvent) => {
    if (shouldLog) onMessage(event)
    if (is(callbacks.onMessage)) callbacks.onMessage(event)
    const { data } = event
    if (await isRelayEventMessage(data) && is(callbacks.onEventMessage)) callbacks.onEventMessage(data as RelayEventMessage)
    if (isRelayNoticeMessage(data) && is(callbacks.onNoticeMessage)) callbacks.onNoticeMessage(data as RelayNoticeMessage)
    if (isRelayEOSEMessage(data) && is(callbacks.onEOSEMessage)) callbacks.onEOSEMessage(data as RelayEOSEMessage)
    if (isRelayOKMessage(data) && is(callbacks.onOKMessage)) callbacks.onOKMessage(data as RelayOKMessage)
    if (await isRelayAuthMessage(data) && is(callbacks.onAuthMessage)) callbacks.onAuthMessage(data as RelayAuthMessage)
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

  const sendAuth = (event: NostrEvent) => {
    send(createClientAuthMessage(event))
  }

  return {
    sendEvent,
    sendReq,
    sendClose,
    sendAuth
  }
}
