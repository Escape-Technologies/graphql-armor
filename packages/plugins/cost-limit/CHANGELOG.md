# @escape.tech/graphql-armor-cost-limit

## 2.4.1

### Minor Changes

- 5a32954: Fix security advisory GHSA-733v-p3h5-qpq7 related to cost-limit bypass.

## 2.4.0

### Minor Changes

- bc9e2d0: cost limit: flatten fragment option support

## 2.3.0

### Minor Changes

- eabdd54: Add exposeLimit [!716](https://github.com/Escape-Technologies/graphql-armor/issues/716)

## 2.2.0

### Minor Changes

- 723f633: chore: dependencies bump

  Envelop is not correctly deployed.
  Drop apollo v3 example.

## 2.1.0

### Minor Changes

- d55e3d4: chore(deps): bump devDependencies to GraphQL 16.7.1

## 2.0.0

### Major Changes

- 0c95d1a: - chore(rep): Drop support for node 14 and require node 16 or higher. [#420](https://github.com/Escape-Technologies/graphql-armor/pull/420)
  - chore(deps): Update envelop (major) [#418](https://github.com/Escape-Technologies/graphql-armor/pull/418)

## 1.7.3

### Patch Changes

- 3c004d5: -- No code changes --
  chore(docs): Link to online documentation
  chore(readme): Update README.md

## 1.7.2

### Patch Changes

- 8d0ab85: Fix: Inline fragment visitor (Thanks @simoncrypta @dthyresson)

## 1.7.1

### Patch Changes

- 097334a: graceful handler for recursive fragments

## 1.7.0

### Minor Changes

- c4f8145: Remove OperationDefinition from calculation
  The global cost is decreased by a depthFactor.

## 1.6.1

## 1.6.0

### Minor Changes

- 59626ad: feat(docs): dedicated docs site

  fix(dev): install-dev script mookme init

  chore(deps/example): bump
  chore(deps/monorepo): bump linters & tools
  chore(optional-deps/_): envelop v3 support
  chore(optional-deps/_): bump apollo-server to 3.11

## 1.5.0

### Minor Changes

- 3b204b6: refactor(apollo): throwOnRejection #220

  - throwOnRejection became propagateOnRejection.

  - Apollo will now **report to context** by default.
    Errors might be very verbose but this is the best way to handle it until Apollo Server 4 is released.
    If you want to still throw errors, you can use the onReject callback, however, you will need to handle the HTTP 500 afterwards yourself.

## 1.4.0

### Minor Changes

- c16a2bb: Feat(plugins)/provide-custom-configuration-callbacks

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

## 1.3.1

### Patch Changes

- feaaf34: chore(deps):

  - Drop peerDependencies in favor of optionalDependencies.
  - GraphQL JS has been fixed to v16.6.0 in devDependencies and examples.

## 1.3.0

### Minor Changes

- 6176fd2: ### feat: - Add max-tokens package (@n1ru4l) - Remove character-limit from core - Include limitation message:
  `Syntax Error: ${plugin} limit of ${limit} exceeded, found ${found}.`

  ### chore:

      - Drop `apollo-server` / `@types/node` direct dependencies
      - Tests consistency

  ### repo:

      - Update examples
      - Update renovate config, nopin/nogroup

## 1.2.3

### Patch Changes

- cadf453: fix:
  - nullish coalescing operator evaluation
    will now be made through babel plugin

## 1.2.2

### Patch Changes

- 0c5d3db: fix: readme package name

## 1.2.1

### Patch Changes

- f8a2a9b: refactor: usage of Required type

## 1.2.0

### Minor Changes

- 1815f8b: feat: integrate tests
  refactor: implicit plugin enable
  refactor: implicit plugin option

## 1.1.0

### Minor Changes

- f86b7a0: fragment support & safety
