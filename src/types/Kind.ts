import isNumber from "../lib/utils/isNumber"
import { isNot } from "../lib/utils/is"

export const kinds = {
  0: "set_metadata",
  1: "text_note",
  2: "recommend_server",
  3: "contact_list",
  4: "encrypted_dm"
}

export type Kind = keyof typeof kinds
export type KindName = string
export type KindOrName = Kind | KindName

export const isKind = (kind: unknown) : kind is Kind => {
  return isNumber(kind) && Object.prototype.hasOwnProperty.call(kinds, kind)
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