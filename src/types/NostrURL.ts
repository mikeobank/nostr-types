import isString from "../lib/utils/isString"

type NostrURL = `nostr:${ string }`

export const isNostrURL = (nostrURL: unknown) : nostrURL is NostrURL => {
  return isString(nostrURL) && /^nostr:/.test(nostrURL)
}