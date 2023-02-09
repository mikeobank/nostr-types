import isString from "../lib/utils/isString"

type Domain = string
type LocalPart = string
type WellKnownURL = `https://${ Domain }/.well-known/nostr.json?name=${ LocalPart }`

export const isDomain = (domain: unknown) : domain is Domain => {
  const domainRegex = /^([a-z0-9][a-z0-9-]*[a-z0-9]\.)*([a-z0-9][a-z0-9-]{0,61}[a-z0-9])\.[a-z]{2,}$/i
  return isString(domain) && domainRegex.test(domain)
}

export const isLocalPart = (localPart: unknown) : localPart is LocalPart => {
  const localPartRegex = /^[a-z0-9-_.]+$/i
  return isString(localPart) && localPartRegex.test(localPart)
}

export const parseInternetIdentifier = (internetIdentifier: string) : [LocalPart, Domain]=> {
  const parts = internetIdentifier.split("@")
  if (parts.length !== 2 || isLocalPart(parts[0]) === false || isDomain(parts[1]) === false) {
    throw new Error("Invalid Internet Identifier")
  }
  return parts as [LocalPart, Domain]
}

export const createWellKnownURL = (domain: Domain, localPart: LocalPart) : WellKnownURL => {
  return `https://${ domain }/.well-known/nostr.json?name=${ localPart }`
}