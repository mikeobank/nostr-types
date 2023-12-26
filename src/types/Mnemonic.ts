import { validateMnemonic, generateMnemonic as bip39GenerateMnemonic, mnemonicToSeed } from "@scure/bip39"
import { HDKey } from "@scure/bip32"
import { Wordlist } from "./MnemonicWordlist.js"
import { PrivateKey } from "./PrivateKey.js"
import { isUInt } from "../lib/utils/isNumber.js"
import { isArrayOfSize } from "../lib/utils/isSize.js"
import isString from "../lib/utils/isString.js"
import isIn from "../lib/utils/isIn.js"
import { isNot } from "../lib/utils/is.js"

export type MnemonicWord = string
export type Mnemonic =
  [MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord] |
  [MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord,
   MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord, MnemonicWord]
export type MnemonicLength = 12 | 24
export type Passphrase = string

export type Account = number
export type DerivationPath = `m/44'/1237'/${ Account }'/0/0`

export const isMnemonicWord = (word: unknown, wordlist: Wordlist) : word is MnemonicWord => {
  return isString(word) && isIn(wordlist, word)
}

export const areMnemonicWords = (words: Array<unknown>, wordlist: Wordlist) : words is Array<MnemonicWord> => {
  return words.every(word => isMnemonicWord(word, wordlist))
}

export const mnemonicToString = (mnemonic: Mnemonic) : string => {
  return mnemonic.join(" ")
}

export const isMnemonic = (mnemonic: unknown, wordlist: Wordlist) : mnemonic is Mnemonic => {
  return (isArrayOfSize(mnemonic, 12) || isArrayOfSize(mnemonic, 24)) &&
    areMnemonicWords(mnemonic, wordlist) &&
    validateMnemonic(mnemonicToString(mnemonic as Mnemonic), wordlist)
}

export const createMnemonic = (str: string, wordlist: Wordlist) : Mnemonic => {
  const mnemonic = str.split(" ")
  if (isMnemonic(mnemonic, wordlist) === false) throw new Error("Invalid mnemonic string")
  return mnemonic as Mnemonic
}

export const generateMnemonic = (wordlist: Wordlist, length: MnemonicLength = 12) : Mnemonic => {
  const strength = length === 24 ? 256 : 128
  return createMnemonic(bip39GenerateMnemonic(wordlist, strength), wordlist)
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

export const getPrivateKeyFromMnenomic = async (mnemonic: Mnemonic, wordlist: Wordlist, passphrase?: Passphrase, account: Account = 0) : Promise<PrivateKey> => {
  if (isMnemonic(mnemonic, wordlist) === false) throw new Error("Invalid mnemonic")
  const seed = await mnemonicToSeed(mnemonicToString(mnemonic), passphrase)
  const hdkey = HDKey.fromMasterSeed(seed)
  const path = createDerivationPath(account)
  const { privateKey } = hdkey.derive(path)
  if (isNot(privateKey)) throw new Error("Could not get private key from mnemonic")
  return privateKey
}