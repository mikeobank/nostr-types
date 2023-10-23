import isArray from "../lib/utils/isArray.js"
import { isNotEmpty } from "../lib/utils/isEmpty.js"
import isIn from "../lib/utils/isIn.js"
import isString from "../lib/utils/isString.js"

export type RelayURL = string
export type RelayURLs = RelayURL[]

const protocols = ["ws", "wss"]
type Protocol = typeof protocols[number]
const isProtocol = (protocol: unknown) : protocol is Protocol => isIn(protocols, protocol)

const trimSlashes = (s: string) => s.replace(/^\/+/, "").replace(/\/+$/, "")

export const createRelayURL = (domain: string, path = "", protocol: Protocol = "wss") : RelayURL => {
  const domainAndPath = [domain, path].map(trimSlashes).filter(isNotEmpty).join("/")
  return `${ protocol }://${ domainAndPath }`
}

export const isRelayURL = (relayURL: unknown) : relayURL is RelayURL => {
  if (isString(relayURL)) {
    try {
      const url = new URL(relayURL)
      return isProtocol(url.protocol.replace(/:$/, ""))
    } catch (err) {
      return false
    }
  }
  return false
}

export const areRelayURLs = (relayURLs: unknown) : relayURLs is RelayURLs => {
  if (isArray(relayURLs) && isNotEmpty(relayURLs)) {
    return relayURLs.every(isRelayURL)
  }
  return false
}