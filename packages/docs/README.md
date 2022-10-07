---
home: true
title: GraphQL Armor
heroImage: /images/banner.png
actions:
  - text: Get Started
    link: /guide/getting-started.html
    type: primary
footer: MIT Licensed - Copyright (c) 2022 Escape – GraphQL Security
---

---

<br />

<p style="text-align: center">
  <img alt="CI" src="https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml/badge.svg" />
  <img alt="release" src="https://github.com/Escape-Technologies/graphql-armor/actions/workflows/release.yaml/badge.svg" />
  <img alt="npm" src="https://img.shields.io/npm/v/@escape.tech/graphql-armor" />
  <img alt="codecov" src="https://codecov.io/gh/Escape-Technologies/graphql-armor/branch/main/graph/badge.svg" />

This package is dedicated to any **GraphQL developer** who wants to add a security layer to their API, in a simple and efficient way.

GraphQL Armor mainly focused on limiting the impact of malicious **GraphQL operations**.

You can find more information about the upcoming features on our [issues page](https://github.com/Escape-Technologies/graphql-armor/issues).
</p>

## First steps

- [Getting started](guide/getting-started.md)
- [Supported engines](guide/supported-engines.md)
- Configuration
  - [Apollo Server](guide/configuration/apollo.md)
  - [Envelop](guide/configuration/envelop.md)
- [Plugins](plugins/index.md)
  - [Block field suggestions](plugins/block-field-suggestions.md)
  - [Character limit](plugins/character-limit.md)
  - [Cost limit](plugins/cost-limit.md)
  - [Max Aliases](plugins/max-aliases.md)
  - [Max Depth](plugins/max-depth.md)
  - [Max Directives](plugins/max-directives.md)
  - [Max Tokens](plugins/max-tokens.md)
- API
  - [Armor](api/armor.md)
  - [Types](api/types.md)
- [FAQ](guide/faq.md)
