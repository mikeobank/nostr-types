# Nostr
Nostr types. Factory, validation, and parsing functions in Typescript.
- https://github.com/nostr-protocol/nips

## Nips & Types
### [x] NIP-01: Basic protocol flow description
- Client
- ClientMessage
- Content
- Filters
- Hex
- Id
- NostrEvent
- KeyPair
- Kind
- PublicKey
- RelayMessage
- RelayURL
- Signature
- SubscriptionId
- Tag
- UnixTimestamp
- WebsockerMessageEvent
### [x] NIP-02: Contact List and Petnames
### [x] NIP-03: OpenTimestamps Attestations for Events
- Base64
- NostrEventOTS
### [x] NIP-04: Encrypted Direct Message
- EncryptedDM
### [x] NIP-05: Mapping Nostr keys to DNS-based internet identifiers
- InternetIdentifier
### [ ] NIP-06: Basic key derivation from mnemonic seed phrase
### [x] NIP-07: window.nostr capability for web browsers
- Nostr
### [x] NIP-08: Handling Mentions --- unrecommended: deprecated in favor of NIP-27
### [x] NIP-09: Event Deletion
### [x] NIP-10: Conventions for clients' use of e and p tags in text events
### [x] NIP-11: Relay Information Document
- RelayInformationDocument
### [x] NIP-13: Proof of Work
### [x] NIP-14: Subject tag in text events
### [ ] NIP-15: Nostr Marketplace (for resilient marketplaces)
### [x] NIP-18: Reposts
### [x] NIP-19: bech32-encoded entities
- Bech32
### [ ] NIP-21: nostr: URI scheme
### [x] NIP-22: Event created_at Limits
### [x] NIP-23: Long-form Content
### [x] NIP-25: Reactions
### [x] NIP-26: Delegated Event Signing
- DelegationString
### [x] NIP-27: Text Note References
### [x] NIP-28: Public Chat
### [ ] NIP-30: Custom Emoji
### [ ] NIP-31: Dealing with Unknown Events
### [ ] NIP-32: Labeling
### [ ] NIP-36: Sensitive Content
### [x] NIP-38: User Statuses
### [ ] NIP-39: External Identities in Profiles
### [x] NIP-40: Expiration Timestamp
### [ ] NIP-42: Authentication of clients to relays
### [ ] NIP-45: Counting results
### [ ] NIP-46: Nostr Connect
### [ ] NIP-47: Wallet Connect
### [ ] NIP-48: Proxy Tags
### [ ] NIP-50: Search Capability
### [ ] NIP-51: Lists
### [ ] NIP-52: Calendar Events
### [ ] NIP-53: Live Activities
### [ ] NIP-56: Reporting
### [ ] NIP-57: Lightning Zaps
### [ ] NIP-58: Badges
### [x] NIP-65: Relay List Metadata
### [ ] NIP-72: Moderated Communities
### [x] NIP-78: Application-specific data
### [ ] NIP-89: Recommended Application Handlers
### [ ] NIP-94: File Metadata
### [ ] NIP-98: HTTP Auth
### [ ] NIP-99: Classified Listings

## To Do
- remove all async functions in call chain to removed async `sign` and `verify`
