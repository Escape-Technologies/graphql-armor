# @escape.tech/graphql-armor-block-field-suggestions

## 3.0.1

### Patch Changes

- 13978ed: Inherit the plugin context from envelop

## 3.0.0

### Major Changes

- 0a26be4: feat(field-suggestion): remove extra chars

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

## 1.4.1

### Patch Changes

- 3c004d5: -- No code changes --
  chore(docs): Link to online documentation
  chore(readme): Update README.md

## 1.4.0

### Minor Changes

- 59626ad: feat(docs): dedicated docs site

  fix(dev): install-dev script mookme init

  chore(deps/example): bump
  chore(deps/monorepo): bump linters & tools
  chore(optional-deps/_): envelop v3 support
  chore(optional-deps/_): bump apollo-server to 3.11

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

- 0c5d3db: fix: readme package name

## 1.2.2

### Patch Changes

- f8a2a9b: refactor: usage of Required type

## 1.2.1

### Patch Changes

- 8e2f90c: feat(field-suggestion): mask usage

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
