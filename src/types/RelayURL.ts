import { isNotEmpty } from "../lib/utils/isEmpty"
import isIn from "../lib/utils/isIn"

export type RelayURL = string

const protocols = ["ws", "wss"]
type Protocol = typeof protocols[number]
const isProtocol = (protocol: unknown) : protocol is Protocol => isIn(protocols, protocol)

const trimSlashes = (s: string) => s.replace(/^\/+/, "").replace(/\/+$/, "")

export const createRelayURL = (domain: string, path = "", protocol: Protocol = "wss") : RelayURL => {
  const domainAndPath = [domain, path].map(trimSlashes).filter(isNotEmpty).join("/")
  return `${ protocol }://${ domainAndPath }`
}

export const isRelayURL = (relayURL: string) : relayURL is RelayURL => {
  try {
    const url = new URL(relayURL)
    return isProtocol(url.protocol.replace(/:$/, ""))
  } catch (err) {
    return false
  }
}