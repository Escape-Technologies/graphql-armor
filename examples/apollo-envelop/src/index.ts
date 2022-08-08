import { envelop, useSchema, useTiming } from '@envelop/core';
import { EnvelopArmor } from '@escape.tech/graphql-armor';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const schema = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      hello: String!
      books: [Book]
    }

    type Book {
      title: String
      author: String
    }
  `,
  resolvers: {
    Query: {
      books: () => books,
      hello: () => 'World',
    },
  },
});

const armor = new EnvelopArmor();
const enhancements = armor.protect();

const getEnveloped = envelop({
  plugins: [
    useSchema(schema),
    useTiming(),
    ...enhancements.plugins,
    {
      onValidate: () => {
        console.log('on validate');
      },
      onParse: () => {
        console.log('on parse');
      },
      onEnveloped: () => {
        console.log('on enveloped');
      },
      onContextBuilding: () => {
        console.log('on context building');
      },
      onExecute: () => {
        console.log('on execute');
      },
      onPluginInit: () => {
        console.log('on plugin initialize');
      },
      onResolverCalled: () => {
        console.log('on resolver called');
      },
      onSchemaChange: () => {
        console.log('on schema change');
      },
    },
  ],
});

const server = new ApolloServer({
  schema,
  executor: async (requestContext) => {
    const { schema, execute, contextFactory } = getEnveloped({ req: requestContext.request.http });

    return execute({
      schema,
      document: requestContext.document,
      contextValue: await contextFactory(),
      variableValues: requestContext.request.variables,
      operationName: requestContext.operationName,
    });
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({ endpoint: '/graphql' })],
});

server.listen(4000);
