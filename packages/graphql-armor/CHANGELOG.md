# @escape.tech/graphql-armor

## 3.1.3

### Patch Changes

- Updated dependencies
  - @escape.tech/graphql-armor-max-aliases@2.6.1

## 3.1.2

### Patch Changes

- Updated dependencies [0a26be4]
  - @escape.tech/graphql-armor-block-field-suggestions@3.0.0

## 3.1.1

### Patch Changes

- bc9e2d0: cost limit: flatten fragment option support
- Updated dependencies [bc9e2d0]
  - @escape.tech/graphql-armor-cost-limit@2.4.0

## 3.1.0

### Minor Changes

- eabdd54: Add exposeLimit [!716](https://github.com/Escape-Technologies/graphql-armor/issues/716)

### Patch Changes

- Updated dependencies [eabdd54]
  - @escape.tech/graphql-armor-max-directives@2.3.0
  - @escape.tech/graphql-armor-max-aliases@2.6.0
  - @escape.tech/graphql-armor-cost-limit@2.3.0
  - @escape.tech/graphql-armor-max-tokens@2.5.0
  - @escape.tech/graphql-armor-max-depth@2.4.0
  - @escape.tech/graphql-armor-types@0.7.0

## 3.0.1

### Patch Changes

- Updated dependencies [ca9f663]
  - @escape.tech/graphql-armor-max-aliases@2.5.0

## 3.0.0

### Minor Changes

- 723f633: chore: dependencies bump

  Envelop is not correctly deployed.
  Drop apollo v3 example.

### Patch Changes

- Updated dependencies [723f633]
  - @escape.tech/graphql-armor-block-field-suggestions@2.2.0
  - @escape.tech/graphql-armor-cost-limit@2.2.0
  - @escape.tech/graphql-armor-max-aliases@2.4.0
  - @escape.tech/graphql-armor-max-depth@2.3.0
  - @escape.tech/graphql-armor-max-directives@2.2.0
  - @escape.tech/graphql-armor-max-tokens@2.4.0
  - @escape.tech/graphql-armor-types@0.6.0

## 2.4.0

### Minor Changes

- 2136d91: ci: drop node 16 support

### Patch Changes

- Updated dependencies [c5d066d]
- Updated dependencies [484a11c]
  - @escape.tech/graphql-armor-max-aliases@2.3.0
  - @escape.tech/graphql-armor-max-tokens@2.3.0

## 2.3.2

### Patch Changes

- Updated dependencies [a21f0f4]
  - @escape.tech/graphql-armor-max-aliases@2.2.0

## 2.3.1

### Patch Changes

- e812da5: set peerDependencies to optional

## 2.3.0

### Minor Changes

- 9d53465: Make Types lib peerDependencies instead of optionalDependencies

## 2.2.0

### Minor Changes

- d55e3d4: chore(deps): bump devDependencies to GraphQL 16.7.1

### Patch Changes

- Updated dependencies [d55e3d4]
  - @escape.tech/graphql-armor-block-field-suggestions@2.1.0
  - @escape.tech/graphql-armor-cost-limit@2.1.0
  - @escape.tech/graphql-armor-max-aliases@2.1.0
  - @escape.tech/graphql-armor-max-depth@2.2.0
  - @escape.tech/graphql-armor-max-directives@2.1.0
  - @escape.tech/graphql-armor-max-tokens@2.2.0

## 2.1.0

### Minor Changes

- f238e37: Add flattenFragments option to max-depth plugin. [#436](https://github.com/Escape-Technologies/graphql-armor/pull/436)
- 781450a: Remove the found count from the max tokens plugin. [#430](https://github.com/Escape-Technologies/graphql-armor/pull/430)

### Patch Changes

- Updated dependencies [f238e37]
- Updated dependencies [781450a]
  - @escape.tech/graphql-armor-max-depth@2.1.0
  - @escape.tech/graphql-armor-max-tokens@2.1.0

## 2.0.0

### Major Changes

- 0c95d1a: - chore(rep): Drop support for node 14 and require node 16 or higher. [#420](https://github.com/Escape-Technologies/graphql-armor/pull/420)
  - chore(deps): Update envelop (major) [#418](https://github.com/Escape-Technologies/graphql-armor/pull/418)

### Patch Changes

- Updated dependencies [0c95d1a]
  - @escape.tech/graphql-armor-block-field-suggestions@2.0.0
  - @escape.tech/graphql-armor-max-directives@2.0.0
  - @escape.tech/graphql-armor-max-aliases@2.0.0
  - @escape.tech/graphql-armor-cost-limit@2.0.0
  - @escape.tech/graphql-armor-max-tokens@2.0.0
  - @escape.tech/graphql-armor-max-depth@2.0.0

## 1.8.2

### Patch Changes

- 3c004d5: -- No code changes --
  chore(docs): Link to online documentation
  chore(readme): Update README.md
- Updated dependencies [3c004d5]
  - @escape.tech/graphql-armor-block-field-suggestions@1.4.1
  - @escape.tech/graphql-armor-cost-limit@1.7.3
  - @escape.tech/graphql-armor-max-aliases@1.7.2
  - @escape.tech/graphql-armor-max-depth@1.8.4
  - @escape.tech/graphql-armor-max-directives@1.6.5
  - @escape.tech/graphql-armor-max-tokens@1.3.2

## 1.8.1

### Patch Changes

- 8d0ab85: Fix: Inline fragment visitor (Thanks @simoncrypta @dthyresson)
- Updated dependencies [8d0ab85]
  - @escape.tech/graphql-armor-max-directives@1.6.4
  - @escape.tech/graphql-armor-max-aliases@1.7.1
  - @escape.tech/graphql-armor-cost-limit@1.7.2
  - @escape.tech/graphql-armor-max-depth@1.8.3

## 1.8.0

### Minor Changes

- af3437f: # Apollo Server

  - Support Apollo Server 4.0 (thanks @arvi)
  - Migrate Apollo devDependencies: `apollo-server-core` -> `@apollo/server`
  - Migrate Apollo devDependencies: `apollo-server-types` -> `@apollo/server`
  - Fix max tokens inferrence 500 error code

## 1.7.2

### Patch Changes

- Updated dependencies [097334a]
- Updated dependencies [097334a]
  - @escape.tech/graphql-armor-max-aliases@1.7.0
  - @escape.tech/graphql-armor-cost-limit@1.7.1
  - @escape.tech/graphql-armor-max-depth@1.8.2

## 1.7.1

### Patch Changes

- 8e1a154: chore: fixed plugin dependencies version
  chore: bump max-directive to v1.6.3

## 1.7.0

### Minor Changes

- d5dcca2: updates cost-limit plugin to 1.7.0

## 1.6.0

### Minor Changes

- db50253: Moves config types into graphql-armor-types package
- db50253: Exports type GraphQLArmorConfig globally

### Patch Changes

- @escape.tech/graphql-armor-cost-limit@1.6.1
- @escape.tech/graphql-armor-max-aliases@1.6.1
- @escape.tech/graphql-armor-max-depth@1.8.1
- @escape.tech/graphql-armor-max-directives@1.6.1
- @escape.tech/graphql-armor-max-tokens@1.3.1

## 1.5.0

### Minor Changes

- 59626ad: feat(docs): dedicated docs site

  fix(dev): install-dev script mookme init

  chore(deps/example): bump
  chore(deps/monorepo): bump linters & tools
  chore(optional-deps/_): envelop v3 support
  chore(optional-deps/_): bump apollo-server to 3.11

### Patch Changes

- Updated dependencies [59626ad]
  - @escape.tech/graphql-armor-block-field-suggestions@1.4.0
  - @escape.tech/graphql-armor-cost-limit@1.6.0
  - @escape.tech/graphql-armor-max-aliases@1.6.0
  - @escape.tech/graphql-armor-max-depth@1.8.0
  - @escape.tech/graphql-armor-max-directives@1.6.0
  - @escape.tech/graphql-armor-max-tokens@1.3.0

## 1.4.0

### Minor Changes

- 3b204b6: refactor(apollo): throwOnRejection #220

  - throwOnRejection became propagateOnRejection.

  - Apollo will now **report to context** by default.
    Errors might be very verbose but this is the best way to handle it until Apollo Server 4 is released.
    If you want to still throw errors, you can use the onReject callback, however, you will need to handle the HTTP 500 afterwards yourself.

### Patch Changes

- Updated dependencies [3b204b6]
  - @escape.tech/graphql-armor-cost-limit@1.5.0
  - @escape.tech/graphql-armor-max-aliases@1.5.0
  - @escape.tech/graphql-armor-max-depth@1.7.0
  - @escape.tech/graphql-armor-max-directives@1.5.0
  - @escape.tech/graphql-armor-max-tokens@1.2.0

## 1.3.1

### Patch Changes

- 542b49d: fix:
  Incorrect @escape.tech/graphql-armor-types dependency
- Updated dependencies [542b49d]
  - @escape.tech/graphql-armor-max-tokens@1.1.1

## 1.3.0

### Minor Changes

- c16a2bb: v1.3.0

  - Feat(plugins)/provide-custom-configuration-callbacks [#162](https://github.com/Escape-Technologies/graphql-armor/issues/162)
  - Refactor(apollo): changed protection default behavior to contextual report [#191](https://github.com/Escape-Technologies/graphql-armor/issues/191)
  - Chore(deps): new types packages (@escape.tech/graphql-armor-types)
  - Chore(deps): updated devDependencies

### Patch Changes

- Updated dependencies [c16a2bb]
  - @escape.tech/graphql-armor-cost-limit@1.4.0
  - @escape.tech/graphql-armor-max-aliases@1.4.0
  - @escape.tech/graphql-armor-max-depth@1.6.0
  - @escape.tech/graphql-armor-max-directives@1.4.0
  - @escape.tech/graphql-armor-max-tokens@1.1.0

## 1.2.1

### Patch Changes

- feaaf34: chore(deps):

  - Drop peerDependencies in favor of optionalDependencies.
  - GraphQL JS has been fixed to v16.6.0 in devDependencies and examples.

- Updated dependencies [feaaf34]
  - @escape.tech/graphql-armor-block-field-suggestions@1.3.1
  - @escape.tech/graphql-armor-cost-limit@1.3.1
  - @escape.tech/graphql-armor-max-aliases@1.3.1
  - @escape.tech/graphql-armor-max-depth@1.5.1
  - @escape.tech/graphql-armor-max-directives@1.3.1
  - @escape.tech/graphql-armor-max-tokens@1.0.2

## 1.2.0

### Minor Changes

- 6176fd2: ### feat: - Add max-tokens package (@n1ru4l) - Remove character-limit from core - Include limitation message:
  `Syntax Error: ${plugin} limit of ${limit} exceeded, found ${found}.`

  ### chore:

      - Drop `apollo-server` / `@types/node` direct dependencies
      - Tests consistency

  ### repo:

      - Update examples
      - Update renovate config, nopin/nogroup

### Patch Changes

- Updated dependencies [6176fd2]
  - @escape.tech/graphql-armor-block-field-suggestions@1.3.0
  - @escape.tech/graphql-armor-cost-limit@1.3.0
  - @escape.tech/graphql-armor-max-aliases@1.3.0
  - @escape.tech/graphql-armor-max-depth@1.5.0
  - @escape.tech/graphql-armor-max-directives@1.3.0
  - @escape.tech/graphql-armor-max-tokens@1.0.1

## 1.1.1

### Patch Changes

- cadf453: fix:
  - nullish coalescing operator evaluation
    will now be made through babel plugin
- Updated dependencies [cadf453]
  - @escape.tech/graphql-armor-block-field-suggestions@1.2.4
  - @escape.tech/graphql-armor-character-limit@1.3.4
  - @escape.tech/graphql-armor-cost-limit@1.2.3
  - @escape.tech/graphql-armor-max-aliases@1.2.4
  - @escape.tech/graphql-armor-max-depth@1.4.4
  - @escape.tech/graphql-armor-max-directives@1.2.3

## 1.1.0

### Minor Changes

- 6abc6ad: feat(envelop): add plugin initializer

  Simplified `Envelop` plugin initializer.

  ```ts
  createServer({
    schema,
    plugins: [EnvelopArmorPlugin()],
  });
  ```

## 1.0.10

### Patch Changes

- 8e2f90c: feat(field-suggestion): mask usage
- Updated dependencies [8e2f90c]
  - @escape.tech/graphql-armor-block-field-suggestions@1.2.1

## 1.0.8

### Patch Changes

- 1815f8b: feat: integrate tests
  refactor: implicit plugin enable
  refactor: implicit plugin option
- Updated dependencies [1815f8b]
  - @escape.tech/graphql-armor-block-field-suggestions@1.2.0
  - @escape.tech/graphql-armor-character-limit@1.3.0
  - @escape.tech/graphql-armor-cost-limit@1.2.0
  - @escape.tech/graphql-armor-max-aliases@1.2.0
  - @escape.tech/graphql-armor-max-depth@1.3.0
  - @escape.tech/graphql-armor-max-directives@1.2.0

## 1.0.7

### Patch Changes

- a224157: fix: missing readme

## 1.0.6

### Patch Changes

- 9f93a22: refactor: cost limit invidual distribution

## 1.0.5

### Patch Changes

- 16b79bb: refactor: introduce preconstruct
- Updated dependencies [16b79bb]
  - @escape.tech/graphql-armor-block-field-suggestions@1.1.1
  - @escape.tech/graphql-armor-character-limit@1.1.1
  - @escape.tech/graphql-armor-max-aliases@1.1.1
  - @escape.tech/graphql-armor-max-depth@1.1.1
  - @escape.tech/graphql-armor-max-directives@1.1.1

## 1.0.4

### Patch Changes

- 0ae4e5c: fix: release CI

## 1.0.2

### Patch Changes

- 6b50a48: Fix resolution

## 1.0.1

### Patch Changes

- 2609ed4: Readme

## 1.0.0

### Major Changes

- 8fc0350: feat: GraphQL Armor v1

### Patch Changes

- Updated dependencies [8fc0350]
  - @escape.tech/graphql-armor-block-field-suggestions@1.1.0
  - @escape.tech/graphql-armor-character-limit@1.1.0
  - @escape.tech/graphql-armor-max-aliases@1.1.0
  - @escape.tech/graphql-armor-max-depth@1.1.0
  - @escape.tech/graphql-armor-max-directives@1.1.0
