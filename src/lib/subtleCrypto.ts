import { webcrypto } from "crypto"
import isBrowser from "./utils/isBrowser.js"

export default isBrowser ? window.crypto.subtle : webcrypto.subtle