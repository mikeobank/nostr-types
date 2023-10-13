import { wordlists, validateMnemonic, generateMnemonic as bip39GenerateMnemonic, mnemonicToSeed } from "bip39"
import BIP32Factory from 'bip32'
import * as ecc from 'tiny-secp256k1'

import { PrivateKey } from "./KeyPair"
import { isUInt } from "../lib/utils/isNumber"
import { isArrayOfSize } from "../lib/utils/isSize"
import isString from "../lib/utils/isString"
import isIn from "../lib/utils/isIn"
import { isNot } from "../lib/utils/is"

export type MnemonicWord = string
export type Mnemonic =
  [MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord] |
  [MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord,
   MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord]
export type Language = keyof typeof wordlists
export const defaultLanguage: Language = "english"
export type Passphrase = string

export type Account = number
export type DerivationPath = `m/44'/1237'/${ Account }'/0/0`

export const isMnemonicWord = (word: unknown, language: Language = defaultLanguage) : word is MnemonicWord => {
  return isString(word) && isIn(wordlists[language], word)
}

export const areMnemonicWords = (words: Array<unknown>, language: Language = defaultLanguage) : words is Array<MnemonicWord> => {
  return words.every(word => isMnemonicWord(word, language))
}

export const mnemonicToString = (mnemonic: Mnemonic) : string => {
  return mnemonic.join(" ")
}

export const isMnemonic = (mnemonic: unknown, language: Language = defaultLanguage) : mnemonic is Mnemonic => {
  return (isArrayOfSize(mnemonic, 12) || isArrayOfSize(mnemonic, 24)) &&
    areMnemonicWords(mnemonic, language) &&
    validateMnemonic(mnemonicToString(mnemonic as Mnemonic), wordlists[language])
}

export const createMnemonic = (str: string, language: Language = defaultLanguage) : Mnemonic => {
  const mnemonic = str.split(" ")
  if (isMnemonic(mnemonic, language) === false) throw new Error("Invalid mnemonic string")
  return mnemonic as Mnemonic
}

export const generateMnemonic = (length: 12 | 24 = 12, language: Language = defaultLanguage) : Mnemonic => {
  const strength = length === 24 ? 256 : 128
  const wordlist = wordlists[language]
  return createMnemonic(bip39GenerateMnemonic(strength, undefined, wordlist), language)
}

export const isPassphrase = (passphrase: unknown) : passphrase is Passphrase => {
  return isString(passphrase)
}

export const isAccount = (account: unknown) : account is Account => {
  return isUInt(account)
}

export const createDerivationPath = (account: Account = 0) : DerivationPath => {
  if (isAccount(account) === false) throw new Error("Invalid account")
  return `m/44'/1237'/${ account }'/0/0`
}

export const getPrivateKeyFromMnenomic = async (mnemonic: Mnemonic, language: Language = defaultLanguage, passphrase?: Passphrase, account: Account = 0) : Promise<PrivateKey> => {
  if (isMnemonic(mnemonic, language) === false) throw new Error("Invalid mnemonic")
  const buffer = await mnemonicToSeed(mnemonicToString(mnemonic), passphrase)
  const bip32 = BIP32Factory(ecc)
  const node = bip32.fromSeed(buffer)
  const path = createDerivationPath(account)
  const { privateKey } = node.derivePath(path)
  if (isNot(privateKey)) throw new Error("Could not get private key from mnemonic")
  return new Uint8Array(privateKey)
}