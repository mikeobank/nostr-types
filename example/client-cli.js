#!/usr/bin/env node

const { createClient, isRelayURL } = require("../dist/")

// arguments
const relayURL = process.argv[2]
if (isRelayURL(relayURL) === false) {
  console.error("Usage: node client-cli.js [relayURL]")
  return
}

// open connection to client
const filters = {}
const client = createClient(relayURL, undefined, filters, true)

// keep process running
setInterval(() => {}, 2 ** 31 - 1)