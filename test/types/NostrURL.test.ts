import { isNostrURL } from "../../src/types/NostrURL"

test("isNostrURL", () => {
  expect(isNostrURL("")).toBeFalsy()
  expect(isNostrURL("https://example.com")).toBeFalsy()
  expect(isNostrURL("nostr:npub1sn0wdenkukak0d9dfczzeacvhkrgz92ak56egt7vdgzn8pv2wfqqhrjdv9")).toBeTruthy()
  expect(isNostrURL("nostr:nprofile1qqsrhuxx8l9ex335q7he0f09aej04zpazpl0ne2cgukyawd24mayt8gpp4mhxue69uhhytnc9e3k7mgpz4mhxue69uhkg6nzv9ejuumpv34kytnrdaksjlyr9p")).toBeTruthy()
  expect(isNostrURL("nostr:note1fntxtkcy9pjwucqwa9mddn7v03wwwsu9j330jj350nvhpky2tuaspk6nqc")).toBeTruthy()
  expect(isNostrURL("nostr:nevent1qqstna2yrezu5wghjvswqqculvvwxsrcvu7uc0f78gan4xqhvz49d9spr3mhxue69uWhkummnw3ez6un9d3shjtn4de6x2argwghx6egpr4mhxue69uhkummnw3ez6ur4vgh8wetvd3hhyer9wghxuet5nxnepm")).toBeTruthy()
})