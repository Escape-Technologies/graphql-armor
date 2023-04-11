# Apollo Configuration


## FAQ

### I am using Apollo v3 with Apollo-Types V3, how can I use GraphQL Armor?

As stated in [!391](https://github.com/Escape-Technologies/graphql-armor/issues/391), you must pin your version of `@escape.tech/graphql-armor` to `<1.8`.
Apollo V3 EOL is on [Oct 22 2023](https://www.apollographql.com/blog/announcement/backend/announcing-the-end-of-life-schedule-for-apollo-server-2-3/).

### GraphQL Armor event are fired once for multiple queries

[Apollo use cache on parsing and validation](https://www.apollographql.com/docs/apollo-server/integrations/plugins-event-reference/#parsingdidstart).
It normal to have some event not fired by GraphQL Armor as it not getting called again.
You can still create your own workaround but it is unlikely to be supported by GraphQL Armor.
