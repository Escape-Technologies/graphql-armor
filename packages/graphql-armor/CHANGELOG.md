# @escape.tech/graphql-armor

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
