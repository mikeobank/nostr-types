import { NostrEvent } from "./NostrEvent"
import { Base64, isBase64 } from "./Base64"

import { isEvent, isEventSync } from "./NostrEvent"

export type NostrEventOTS = NostrEvent & {
  ots: Base64
}

const hasOTS = (event: NostrEvent) => {
  return isBase64((event as NostrEventOTS).ots)
}

export const isEventOTS = async (event: unknown) : Promise<boolean> => {
  return await isEvent(event) ? hasOTS(event as NostrEvent) : false
}

export const isEventOTSSync = (event: unknown) : event is NostrEventOTS => {
  return isEventSync(event) ? hasOTS(event) : false
}