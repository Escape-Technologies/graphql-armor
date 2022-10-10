---
'@escape.tech/graphql-armor': minor
'@escape.tech/graphql-armor-character-limit': minor
'@escape.tech/graphql-armor-cost-limit': minor
'@escape.tech/graphql-armor-max-aliases': minor
'@escape.tech/graphql-armor-max-depth': minor
'@escape.tech/graphql-armor-max-directives': minor
'@escape.tech/graphql-armor-max-tokens': minor
'@escape.tech/graphql-armor-types': minor
---

refactor(apollo): throwOnRejection #220

- throwOnRejection became propagateOnRejection.

- Apollo will now **report to context** by default.
Errors might be very verbose but this is the best way to handle it until Apollo Server 4 is released.
If you want to still throw errors, you can use the onReject callback, however, you will need to handle the HTTP 500 afterwards yourself.
