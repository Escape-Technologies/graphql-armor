# @escape.tech/graphql-armor-max-aliases

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

## 1.2.4

### Patch Changes

- cadf453: fix:
  - nullish coalescing operator evaluation
    will now be made through babel plugin

## 1.2.3

### Patch Changes

- 08c546a: count field alias in fragment spreads

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

## 1.1.2

### Patch Changes

- d435354: fix: minimize files in tarball

## 1.1.1

### Patch Changes

- 16b79bb: refactor: introduce preconstruct

## 1.1.0

### Minor Changes

- 8fc0350: feat: GraphQL Armor v1
