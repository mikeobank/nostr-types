import isBrowser from "./utils/isBrowser"

export default isBrowser ? window.crypto.subtle : require("crypto").webcrypto.subtle