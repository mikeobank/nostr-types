import { UInt, isUInt } from "../lib/utils/isInt"
import { isNot } from "../lib/utils/is"

export const kinds = {
  0: "set_metadata",
  1: "text_note",
  2: "recommend_server",
  3: "contact_list",
  4: "encrypted_dm",
  5: "deletion",
  7: "reaction",
  40: "channel create",
  41: "channel metadata",
  42: "channel message",
  43: "hide message",
  44: "mute user",
  1984: "reporting",
  22242: "client_authentication"
}

export type Kind = UInt
export type KindName = string
export type KindOrName = Kind | KindName

export const isKind = (kind: unknown) : kind is Kind => {
  return isUInt(kind)
}

export const areKinds = (kinds: unknown[]) : kinds is Kind[] => {
  return kinds.every(isKind)
}

export const kindByName = (name: string) : Kind | undefined => {
  const n = name.trim().toLowerCase().replace(/[\s-]+/g, "_")
  const entry = Object.entries(kinds).find(([, name]) => name === n)
  if (isNot(entry)) return
  const [key] = entry
  const kind = parseInt(key, 10)
  return isKind(kind) ? kind : undefined
}

export const getKind = (kindOrName: KindOrName) => {
  const kind = isKind(kindOrName) ? kindOrName : kindByName(kindOrName)
  if (isNot(kind)) throw new Error(`${ kindOrName } does not correspond to an existing Kind`)
  return kind
}

export const isReplaceableKind = (kind: Kind) => {
  return kind >= 10000 && kind < 20000
}

export const isEphemeralKind = (kind: Kind) => {
  return kind >= 20000 && kind < 30000
}

export const isParameterizedReplaceableKind = (kind: Kind) => {
  return kind >= 30000 && kind < 40000
}

