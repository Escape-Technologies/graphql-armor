# GraphQL Armor 🛡️

GraphQL Armor is a dead-simple yet highly customizable security middleware for various GraphQL server engines.

![GraphQL-Armor banner](https://raw.githubusercontent.com/Escape-Technologies/graphql-armor/main/services/docs/static/img/banner.png)

[![CI](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/ci.yaml) [![release](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/release.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/release.yaml) [![e2e](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/e2e.yaml/badge.svg)](https://github.com/Escape-Technologies/graphql-armor/actions/workflows/e2e.yaml) ![npm](https://img.shields.io/npm/v/@escape.tech/graphql-armor) [![codecov](https://codecov.io/gh/Escape-Technologies/graphql-armor/branch/main/graph/badge.svg)](https://codecov.io/gh/Escape-Technologies/graphql-armor)

## Installation

```bash
# npm
npm install -S @escape.tech/graphql-armor

# yarn
yarn add @escape.tech/graphql-armor
```

## Documentation

[https://escape.tech/graphql-armor/docs/getting-started](https://escape.tech/graphql-armor/docs/getting-started)

## Supported GraphQL Engines

We support the following engines :

- [Apollo Server](https://www.apollographql.com/)
- [GraphQL Yoga](https://www.graphql-yoga.com/)

We additionally support the following engines through the [Envelop](https://www.envelop.dev/) plugin system :

- GraphQL-Helix
- Node.js HTTP
- GraphQL-Helix (with @defer and @stream)
- GraphQL-WS
- GraphQL-SSE
- Azure Functions
- Cloudflare Workers
- Google Cloud Functions
- Lambda AWS
- type-graphql
- nexus
- express-graphql

See [here](https://www.envelop.dev/docs/integrations) for more information about Envelop compatibility.

## Contributing

Ensure you have read the [Contributing Guide](https://github.com/Escape-Technologies/graphql-armor/blob/main/CONTRIBUTING.md) before contributing.

To setup your project, make sure you run the `install-dev.sh` script.

```bash
git clone git@github.com:Escape-Technologies/graphql-armor.git
cd graphql-armor
bash ./install-dev.sh
```

We are using yarn as our package manager and [the workspaces monorepo setup](https://classic.yarnpkg.com/lang/en/docs/workspaces/). Please read the associated documentation and feel free to open issues if you encounter problems when developing on our project!


## 🤝 We're hiring!

We believe it’s time to bring more AI-driven innovation to cybersecurity, and we'd love your help in building this dream! Want to join our adventure? Check out our [**Careers**](https://jobs.escape.tech) page!
