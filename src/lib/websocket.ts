import isBrowser from "./utils/isBrowser.js"
import { w3cwebsocket } from "websocket"

export default isBrowser ? WebSocket : w3cwebsocket