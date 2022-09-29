---
home: true
title: GraphQL Armor
heroImage: /images/banner.png
actions:
  - text: Get Started
    link: /guide/getting-started.html
    type: primary
features:
  - title: Simplicity First
    details: Minimal setup with markdown-centered project structure helps you focus on writing.
  - title: Vue-Powered
    details: Enjoy the dev experience of Vue, use Vue components in markdown, and develop custom themes with Vue.
  - title: Performant
    details: VuePress generates pre-rendered static HTML for each page, and runs as an SPA once a page is loaded.
footer: MIT Licensed - Copyright (c) 2022 Escape – GraphQL Security
---

---

![CI](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml/badge.svg) ![release](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/release.yaml/badge.svg) ![e2e](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/e2e.yaml/badge.svg) ![npm](https://img.shields.io/npm/v/@escape.tech/graphql-armor) ![codecov](https://codecov.io/gh/Escape-Technologies/graphql-armor/branch/main/graph/badge.svg)

This is is dedicated to any **GraphQL developer** who wants to add a security layer to their API in a simple and efficient way.

Currently, we are mainly focused on limiting the impact of expensives **GraphQL operations**.

You can find more information about the upcoming features on our [issues page](https://github.com/Escape-Technologies/graphql-armor/issues).

## First steps

- [Getting started](guide/getting-started.md)
- [Supported engines](guide/supported-engines.md)
- Configuration
  - [Apollo Server](guide/configuration/apollo-server.md)
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
