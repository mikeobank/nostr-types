import { isNotEmpty } from "../lib/utils/isEmpty"

export type RelayURL = string

const protocols = ["ws", "wss"] as const
type Protocol = typeof protocols[number]
const isProtocol = (protocol: string) : protocol is Protocol => protocols.includes(protocol as Protocol)

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