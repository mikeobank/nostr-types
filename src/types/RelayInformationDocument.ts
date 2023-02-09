import { PublicKeyHex } from "./PublicKey"

export type RelayInformationDocument = {
  name?: string
  description?: string
  pubkey?: PublicKeyHex
  contact?: string
  supported_nips?: number[]
  software?: string
  version?: string
}