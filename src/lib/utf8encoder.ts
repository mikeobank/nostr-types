const textEncoder = new TextEncoder()
export const encode = (s: string) => textEncoder.encode(s)

const textDecoder = new TextDecoder()
export const decode = (a: Uint8Array) => textDecoder.decode(a)