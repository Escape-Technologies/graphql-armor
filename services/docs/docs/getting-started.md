---
sidebar_position: 1
---

# Getting started

This package is dedicated to any **GraphQL developer** who wants to add a security layer to their API, in a simple and efficient way.

GraphQL Armor mainly focused on limiting the impact of malicious **GraphQL operations**.

You can find more information about the upcoming features on our [issues page](https://github.com/Escape-Technologies/graphql-armor/issues).

If you need help or want to discuss about the project, you can hop in [project discussions](https://github.com/Escape-Technologies/graphql-armor/discussions).

## Installation

```bash
# npm
npm install -S @escape.tech/graphql-armor

# yarn
yarn add @escape.tech/graphql-armor
```

## Usage

We provided [some examples](https://github.com/Escape-Technologies/graphql-armor/tree/main/examples) to help you get started with GraphQL Armor.

We will detail the usage of GraphQL Armor in the following sections:

- [Apollo Server](#apollo-server)
- [GraphQL Yoga](#graphql-yoga)
- [Envelop](#envelop)

### Apollo Server

If you do not use plugins and validations rules, we recommend you to proceed with the following example:

```ts
import { ApolloArmor } from '@escape.tech/graphql-armor';

interface AppContext {
	token?: string;
}

const armor = new ApolloArmor();

const server = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
  ...armor.protect()
});
```

Otherwise, if you already have some plugins or validation rules, we recommend you to proceed this way:

```ts
import { ApolloArmor } from '@escape.tech/graphql-armor';

interface AppContext {
	token?: string;
}

const armor = new ApolloArmor();
const protection = armor.protect()

const server = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
  ...protection,
  plugins: [...protection.plugins, myPlugin1, myPlugin2 ]
  validationRules: [, ...protection.validationRules, myRule1, myRule2 ]
});
```

### GraphQL Yoga

If you do not use plugins and validations rules, we recommend you to proceed with the following example:

```ts
import { EnvelopArmor } from '@escape.tech/graphql-armor';

const armor = new EnvelopArmor();
const protection = armor.protect()

async function main() {
  const server = createServer({
    schema,
    plugins: [...protection.plugins],
  });
  await server.start();
}

main();
```

Otherwise, if you already have some plugins or validation rules, we recommend you to proceed this way:

```ts
import { EnvelopArmorPlugin } from '@escape.tech/graphql-armor';

async function main() {
  const server = createServer({
    schema,
    plugins: [EnvelopArmorPlugin()],
  });
  await server.start();
}

main();
```

### Envelop

If you do not use plugins and validations rules, we recommend you to proceed with the following example:

```ts
import { EnvelopArmor } from '@escape.tech/graphql-armor';

const armor = new EnvelopArmor();
const protection = armor.protect()

const getEnveloped = envelop({
  plugins: [otherPlugins, ...protection.plugins],
});
```

Otherwise, if you already have some plugins or validation rules, we recommend you to proceed this way:

```ts
import { EnvelopArmorPlugin } from '@escape.tech/graphql-armor';

const getEnveloped = envelop({
  plugins: [otherPlugins, EnvelopArmorPlugin()],
});
```
