#!/usr/bin/env node

const { createClient, isRelayURL } = require("../cjs")
const { w3cwebsocket } = require("websocket")

// arguments
const relayURL = process.argv[2]
if (isRelayURL(relayURL) === false) {
  console.error("Usage: node client-cli.js [relayURL]")
  process.exit()
}

// open connection to client
const filters = {}
const client = createClient(w3cwebsocket)(relayURL, undefined, filters, true)

// keep process running
setInterval(() => {}, 2 ** 31 - 1)