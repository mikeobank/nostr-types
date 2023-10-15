import { webcrypto } from "crypto"
import isBrowser from "./utils/isBrowser"

export default isBrowser ? window.crypto.subtle : webcrypto.subtle