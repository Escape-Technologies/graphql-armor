# Apollo Configuration


## FAQ

### GraphQL Armor event are fired once for multiple queries

[Apollo use cache on parsing and validation](https://www.apollographql.com/docs/apollo-server/integrations/plugins-event-reference/#parsingdidstart).
It normal to have some event not fired by GraphQL Armor as it not getting called again.
You can still create your own workaround but it is unlikely to be supported by GraphQL Armor.
