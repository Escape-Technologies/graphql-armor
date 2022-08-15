---
'@escape.tech/graphql-armor': minor
---

Simplify developer experience by making `EnvelopArmor` class a `Plugin` so it adds individual plugins with `OnPluginInit`'s `addPlugin` in this case.

You can pass `EnvelopArmor` instance to `plugins` directly;

```ts
createServer({
  schema,
  plugins: [new EnvelopArmor()],
});
```
