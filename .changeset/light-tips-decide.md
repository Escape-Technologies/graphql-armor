---
'@escape.tech/graphql-armor': minor
'@escape.tech/graphql-armor-block-field-suggestions': minor
'@escape.tech/graphql-armor-character-limit': minor
'@escape.tech/graphql-armor-cost-limit': minor
'@escape.tech/graphql-armor-max-aliases': minor
'@escape.tech/graphql-armor-max-depth': minor
'@escape.tech/graphql-armor-max-directives': minor
'@escape.tech/graphql-armor-max-tokens': patch
---

### feat:
	- Add max-tokens package (@n1ru4l)
	- Remove character-limit from core
	- Include limitation message:
		`Syntax Error: ${plugin} limit of ${limit} exceeded, found ${found}.`

### chore:
	- Drop `apollo-server` / `@types/node` direct dependencies
	- Tests consistency

### repo:
	- Update examples
	- Update renovate config, nopin/nogroup
