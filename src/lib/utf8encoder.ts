const textEncoder = new TextEncoder()
export const encode = (str: string) : Uint8Array => textEncoder.encode(str)

const textDecoder = new TextDecoder()
export const decode = (arr: Uint8Array) : string => textDecoder.decode(arr)