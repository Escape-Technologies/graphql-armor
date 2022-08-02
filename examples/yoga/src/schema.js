"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const schema_1 = require("@graphql-tools/schema");
const typeDefinitions = /* GraphQL */ `
  type Query {
    hello: String!
  }
`;
const resolvers = {
    Query: {
        hello: () => 'Hello World!',
    },
};
exports.schema = (0, schema_1.makeExecutableSchema)({
    resolvers: [resolvers],
    typeDefs: [typeDefinitions],
});
