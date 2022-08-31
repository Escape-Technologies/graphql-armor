---
'@escape.tech/graphql-armor': minor
---

feat(envelop): add plugin initializer

Simplified `Envelop` plugin initializer.

```ts
createServer({
  schema,
  plugins: [EnvelopArmorPlugin()],
});
```