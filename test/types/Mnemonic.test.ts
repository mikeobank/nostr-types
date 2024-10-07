import { bytesToBech32 } from "../../src/types/Bech32"
import { createHexFromUint8Array } from "../../src/types/Hex"
import { createKeyPair } from "../../src/types/KeyPair"
import { isAccount, isMnemonicWord, isMnemonic, generateMnemonic, createDerivationPath, getPrivateKeyFromMnenomic, createMnemonic, isMnemonicLength } from "../../src/types/Mnemonic"
import { wordlistEnglish, wordlistSpanish, wordlistChineseSimplified, wordlistChineseTraditional } from "../../src/types/MnemonicWordlist"

test("isAccount", () => {
  expect(isAccount(-1)).toBeFalsy()
  expect(isAccount(0.5)).toBeFalsy()
  expect(isAccount(0)).toBeTruthy()
  expect(isAccount(3)).toBeTruthy()
})

test("isMnemonicLength", () => {
  expect(isMnemonicLength("12")).toBeFalsy()
  expect(isMnemonicLength(12)).toBeTruthy()
  expect(isMnemonicLength(24)).toBeTruthy()
  expect(isMnemonicLength(16)).toBeFalsy()
})

test("isMnemonicWord", () => {
  expect(isMnemonicWord("not", wordlistEnglish)).toBeFalsy()
  expect(isMnemonicWord("satoshi", wordlistEnglish)).toBeTruthy()
  expect(isMnemonicWord("absurd", wordlistEnglish)).toBeTruthy()
  expect(isMnemonicWord("absurd", wordlistSpanish)).toBeFalsy()
  expect(isMnemonicWord("ábaco", wordlistSpanish)).toBeTruthy()
  expect(isMnemonicWord("中", wordlistChineseSimplified)).toBeTruthy()
  expect(isMnemonicWord("中", wordlistChineseTraditional)).toBeTruthy()
})

test("isMnemonic", () => {
  expect(isMnemonic([], wordlistEnglish)).toBeFalsy()
  expect(isMnemonic(["satoshi"], wordlistEnglish)).toBeFalsy()
  expect(isMnemonic(["abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "about"], wordlistEnglish)).toBeTruthy()
  expect(isMnemonic(["abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "absurd"], wordlistEnglish)).toBeFalsy()
  expect(isMnemonic(["abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon","art"], wordlistEnglish)).toBeTruthy()
  expect(isMnemonic(["abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon","absurd"], wordlistEnglish)).toBeFalsy()
})

test("createDerivationPath", () => {
  expect(() => createDerivationPath(-1)).toThrow()
  expect(createDerivationPath()).toEqual("m/44'/1237'/0'/0/0")
  expect(createDerivationPath(3)).toEqual("m/44'/1237'/3'/0/0")
})

test("generateMnemonic", () => {
  expect(generateMnemonic(wordlistEnglish)).toHaveLength(12)
  expect(generateMnemonic(wordlistEnglish, 24)).toHaveLength(24)
  expect(generateMnemonic(wordlistEnglish).every(word => isMnemonicWord(word, wordlistEnglish))).toBeTruthy()
  expect(generateMnemonic(wordlistSpanish).every(word => isMnemonicWord(word, wordlistSpanish))).toBeTruthy()
})

test("getPrivateKeyFromMnenomic", async () => {
  expect(async () => await getPrivateKeyFromMnenomic(["abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "about"], wordlistEnglish)).not.toThrow()
  expect(async () => await getPrivateKeyFromMnenomic(["abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "absurd"], wordlistEnglish)).rejects.toThrow()
  expect(
    await getPrivateKeyFromMnenomic(["abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "about"], wordlistEnglish)
  ).not.toEqual(
    await getPrivateKeyFromMnenomic(["abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "about"], wordlistEnglish, "pass phrase")
  )
  expect(
    await getPrivateKeyFromMnenomic(["abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "about"], wordlistEnglish)
  ).not.toEqual(
    await getPrivateKeyFromMnenomic(["abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "about"], wordlistEnglish, undefined, 3)
  )
})

test("test vectors 12", async () => {
  const mnemonic = createMnemonic("leader monkey parrot ring guide accident before fence cannon height naive bean", wordlistEnglish)
  const privateKey = await getPrivateKeyFromMnenomic(mnemonic, wordlistEnglish)
  expect(createHexFromUint8Array(privateKey)).toBe("7f7ff03d123792d6ac594bfa67bf6d0c0ab55b6b1fdb6249303fe861f1ccba9a")
  expect(bytesToBech32(privateKey, "nsec")).toBe("nsec10allq0gjx7fddtzef0ax00mdps9t2kmtrldkyjfs8l5xruwvh2dq0lhhkp")
  const { publicKey } = createKeyPair(privateKey)
  expect(createHexFromUint8Array(publicKey)).toBe("17162c921dc4d2518f9a101db33695df1afb56ab82f5ff3e5da6eec3ca5cd917")
  expect(bytesToBech32(publicKey, "npub")).toBe("npub1zutzeysacnf9rru6zqwmxd54mud0k44tst6l70ja5mhv8jjumytsd2x7nu")
})

test("test vectors 24", async () => {
  const mnemonic = createMnemonic("what bleak badge arrange retreat wolf trade produce cricket blur garlic valid proud rude strong choose busy staff weather area salt hollow arm fade", wordlistEnglish)
  const privateKey = await getPrivateKeyFromMnenomic(mnemonic, wordlistEnglish)
  expect(createHexFromUint8Array(privateKey)).toBe("c15d739894c81a2fcfd3a2df85a0d2c0dbc47a280d092799f144d73d7ae78add")
  expect(bytesToBech32(privateKey, "nsec")).toBe("nsec1c9wh8xy5eqdzln7n5t0ctgxjcrdug73gp5yj0x03gntn67h83twssdfhel")
  const { publicKey } = createKeyPair(privateKey)
  expect(createHexFromUint8Array(publicKey)).toBe("d41b22899549e1f3d335a31002cfd382174006e166d3e658e3a5eecdb6463573")
  expect(bytesToBech32(publicKey, "npub")).toBe("npub16sdj9zv4f8sl85e45vgq9n7nsgt5qphpvmf7vk8r5hhvmdjxx4es8rq74h")
})

/*
xtest("generate 12 word mnemonic", async () => {
  const mnemonic = generateMnemonic()
  const privateKey = await getPrivateKeyFromMnenomic(mnemonic)
  const nsec = bytesToBech32(privateKey, "nsec")
  const { publicKey } = createKeyPair(privateKey)
  const npub = bytesToBech32(publicKey, "npub")
  console.log(`
    mnemonic: ${ mnemonicToString(mnemonic) }
    private key (hex): ${ createHexFromUint8Array(privateKey) }
    nsec: ${ nsec }
    public key (hex): ${ createHexFromUint8Array(publicKey) }
    npub: ${ npub }
  `)
})
*/