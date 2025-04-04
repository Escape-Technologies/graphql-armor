# @escape.tech/graphql-armor-types

## 0.7.0

### Minor Changes

- eabdd54: Add exposeLimit [!716](https://github.com/Escape-Technologies/graphql-armor/issues/716)

## 0.6.0

### Minor Changes

- 723f633: chore: dependencies bump

  Envelop is not correctly deployed.
  Drop apollo v3 example.

## 0.5.0

### Minor Changes

- d55e3d4: chore(deps): bump devDependencies to GraphQL 16.7.1

## 0.4.1

### Patch Changes

- 3c004d5: -- No code changes --
  chore(docs): Link to online documentation
  chore(readme): Update README.md

## 0.4.0

### Minor Changes

- db50253: Moves config types into graphql-armor-types package

## 0.3.0

### Minor Changes

- 59626ad: feat(docs): dedicated docs site

  fix(dev): install-dev script mookme init

  chore(deps/example): bump
  chore(deps/monorepo): bump linters & tools
  chore(optional-deps/_): envelop v3 support
  chore(optional-deps/_): bump apollo-server to 3.11

## 0.2.0

### Minor Changes

- 3b204b6: refactor(apollo): throwOnRejection #220

  - throwOnRejection became propagateOnRejection.

  - Apollo will now **report to context** by default.
    Errors might be very verbose but this is the best way to handle it until Apollo Server 4 is released.
    If you want to still throw errors, you can use the onReject callback, however, you will need to handle the HTTP 500 afterwards yourself.

## 0.1.0

### Minor Changes

- c16a2bb: Created a new package dedicated to typing
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
