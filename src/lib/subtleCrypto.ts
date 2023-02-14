import isBrowser from "./utils/isBrowser"

export default async () => {
  return isBrowser ? window.crypto.subtle : (await import("crypto")).webcrypto.subtle
}