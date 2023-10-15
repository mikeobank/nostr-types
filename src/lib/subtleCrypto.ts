import isBrowser from "./utils/isBrowser"

// eslint-disable-next-line @typescript-eslint/no-var-requires
export default isBrowser ? window.crypto.subtle : require("crypto").webcrypto.subtle