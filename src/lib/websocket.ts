import isBrowser from "./utils/isBrowser"
import { w3cwebsocket } from "websocket"

export default isBrowser ? WebSocket : w3cwebsocket