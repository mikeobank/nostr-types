#!/usr/bin/env node

const http = require("http")
const WebSocketServer = require("websocket").server

const server = http.createServer((request, response) => {
  console.log((new Date()) + ' Received request for ' + request.url)
  response.writeHead(404)
  response.end()
})
server.listen(8080, () => {
  console.log((new Date()) + " Server is listening on port 8080")
})

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
})

const connections = []
const messages = []

wsServer.on("request", request => {

  console.log("request", request)

  const connection = request.accept("echo-protocol", request.origin)

  connection.on("message", message => {
    if (message.type === "utf8") {
      try {
        const messageArr = JSON.parse(message.utf8Data)
        if (Array.isArray(messageArr)) {
          switch (messageArr[0]) {
            case "REQ":
              requests[messageArr[1]] = messageArr[2]
              connection.sendUTF(messages)
              break
            case "EVENT":
              messages.push = messageArr[2]
              break
            case "CLOSE":
              delete requests[messageArr[1]]
              break
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
  })

  connection.on("close", (reasonCode, description) => {
    console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.")
  })

  connections.push({
    remoteAddress: connection.remoteAddress,
    connection,
    subscriptions: {}
  })
})