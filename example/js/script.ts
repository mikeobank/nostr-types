import { createClient, isRelayURL, isFilters, createUnixTimestamp, createEvent, generateKeyPair, createHexFromUint8Array  } from "../../esm/"

// utils
const showElem = (elem: HTMLElement, show: boolean) => elem.setAttribute("style", `display: ${ show ? "initial" : "none" }`)

// key pair
const dlPublicKey = document.querySelector("dl#public-key")
const dlPrivateKey = document.querySelector("dl#private-key")

const { publicKey, privateKey } = generateKeyPair()
dlPublicKey?.appendChild(document.createTextNode(createHexFromUint8Array(publicKey)))
dlPrivateKey?.appendChild(document.createTextNode(createHexFromUint8Array(privateKey)))

// connect form
const form = document.querySelector<HTMLFormElement>("form#connect")
const input = document.querySelector<HTMLInputElement>("input[name='url']")
const inputFilterIds = document.querySelector<HTMLInputElement>("input[name='filters.ids']")
const inputFilterAuthors = document.querySelector<HTMLInputElement>("input[name='filters.authors']")
const inputFilterKinds = document.querySelector<HTMLInputElement>("input[name='filters.kinds']")
const inputFilterE = document.querySelector<HTMLInputElement>("input[name='filters.#e']")
const inputFilterP = document.querySelector<HTMLInputElement>("input[name='filters.#p']")
const inputFilterSince = document.querySelector<HTMLInputElement>("input[name='filters.since']")
const inputFilterUntil = document.querySelector<HTMLInputElement>("input[name='filters.until']")
const inputFilterLimit = document.querySelector<HTMLInputElement>("input[name='filters.limit']")

const stringToArray = (str: string | undefined) => str?.split(",").map(s => s.trim()).filter(s => s !== "") ?? []
const stringToUnixTimestamp = (str: string | undefined) => str !== undefined ? createUnixTimestamp(str) : undefined
const stringToInt = (str: string | undefined) => {
  if (str === undefined) return
  const int = parseInt(str, 10)
  if (Number.isNaN(int)) return
  return int
}
const parseFilters = () => {
  const filters: Record<string, unknown> = {}
  const ids = stringToArray(inputFilterIds?.value)
  if (ids.length > 0) filters.ids = ids
  const authors = stringToArray(inputFilterAuthors?.value)
  if (authors.length > 0) filters.authors = authors
  const kinds = stringToArray(inputFilterKinds?.value)
  if (kinds.length > 0) filters.kinds = kinds
  const e = stringToArray(inputFilterE?.value)
  if (e.length > 0) filters.e = e
  const p = stringToArray(inputFilterP?.value)
  if (p.length > 0) filters.p = p
  const since = stringToUnixTimestamp(inputFilterSince?.value)
  if (since !== undefined) filters.since = since
  const until = stringToUnixTimestamp(inputFilterUntil?.value)
  if (until !== undefined) filters.until = until
  const limit = stringToInt(inputFilterLimit?.value)
  if (limit !== undefined) filters.limit = limit
  return isFilters(filters) ? filters : {}
}

// relays
const relayWrapper = document.querySelector("#relay-wrapper")
const closeButton = document.querySelector<HTMLButtonElement>("button#close")

const relays = {}
const allRelays = () => Object.keys(relays).map(url => ({ relay: relays[url], url }))
const getRelay = (url: string) => relays[url]
const hasRelay = (url: string) => getRelay(url) !== undefined

const renderRelays = () => {

  // clear wrapper
  while (relayWrapper?.firstChild) {
    relayWrapper?.removeChild(relayWrapper?.firstChild)
  }

  // display relays
  Object.keys(relays).map(relay => {
    const li = document.createElement("li")
    li.appendChild(document.createTextNode(relay))
    return li
  }).forEach(li => relayWrapper?.appendChild(li))

  // show / hide close button
  if (closeButton != null) {
    const show = Object.keys(relays).length > 0
    showElem(closeButton, show)
  }
}

form?.addEventListener("submit", event => {
  event.preventDefault()
  const url = (input?.value ?? "").trim()
  if (isRelayURL(url) === false) return alert("Invalid URL")
  const parsedFilters = parseFilters()
  const filters = Object.keys(parsedFilters).length > 0 ? parsedFilters : undefined
  if (hasRelay(url) !== undefined) {
    relays[url] = createClient(url, undefined, filters, true)
  } else if (filters !== undefined) {
    getRelay(url).sendReq(filters)
  }
  renderRelays()
})

closeButton?.addEventListener("click", () => {
  allRelays().forEach(({ relay, url }) => {
    relay._subscriptionIds.forEach(subscriptionId => relay.sendClose(subscriptionId))
    relay._webSocket.close()
    delete relays[url]
  })
  renderRelays()
})

renderRelays()

// send form
const sendForm = document.querySelector<HTMLFormElement>("form#send")
const inputSendContent = document.querySelector<HTMLInputElement>("input[name='send.content']")

sendForm?.addEventListener("submit", async event => {
  event.preventDefault()
  const content = inputSendContent?.value ?? ""
  const nostrEvent = await createEvent(privateKey)(1, [], content)
  allRelays().forEach(({ relay }) => relay.sendEvent(nostrEvent))
})
