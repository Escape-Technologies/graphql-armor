---
'@escape.tech/graphql-armor-character-limit': minor
'@escape.tech/graphql-armor-cost-limit': minor
'@escape.tech/graphql-armor-max-aliases': minor
'@escape.tech/graphql-armor-max-depth': minor
'@escape.tech/graphql-armor-max-directives': minor
'@escape.tech/graphql-armor-max-tokens': minor
'@escape.tech/graphql-armor-types': minor
---

Feat(plugins)/provide-custom-configuration-callbacks

```
{
  onAccept: [],
  onReject: [],
  throwRejection: bool,
}
```

- Granted the ability to choose whenever you want to throw or not.
- Introduced callbacks that can be runned before reject the query, for observability purposes.

- added devDependencies to @escape.tech/graphql-armor-types
