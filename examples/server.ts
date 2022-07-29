import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';

const express = require('express');
const http = require('http');
import {gql} from 'apollo-server';
import {GQLArmor} from '../src';
import {WEIGHTS} from "../lib/graphql-validation-complexity";

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Nested {
    child: Nested
    text: String
  }

  type Query {
    books: [Book]
    nested: Nested
  }

  type Mutation {
    addBook(title: String, author: String): Book
  }
`;

const books = [{
  title: 'The Awakening', author: 'Kate Chopin',
}, {
  title: 'City of Glass', author: 'Paul Auster',
},];

const nestedResolver = (i = 0) => {
  return async () => {
    await new Promise(resolve => setTimeout(resolve, 50*i));
    return {
      child: nestedResolver(i + 1), text: "text" + i
    }
  }
}

const resolvers = {
  Query: {
    books: () => books, nested: nestedResolver(0)
  }, Mutation: {
    addBook: (title: string, author: string) => {
      return {title: 'title_test', author: 'author_test'};
    },
  },
};

const app = express();

const httpServer = http.createServer(app);

const armor = new GQLArmor({
  CharacterLimit: {
    options: {
      maxLength: 10000,
    },
  }, Introspection: {
    enabled: true,
  },
}, (status: string, plugin: any) => {
  console.log(status, plugin._namespace);
},);


const registerPerf = (name:string,df:number) =>
{
  console.log(name,df);
  WEIGHTS.add(name,df)
}
const  getResolverName = (prefix:string, key) => (prefix === 'ROOT' ? key : `${prefix}/${key}`);

const monitor = (fn, reporter, name) => async (...args) => {
  const t0 = performance.now();
  try {
    const result = await fn(...args);
    return wrapFunc(result,reporter,name);
  } catch (err) {
    throw err;
  }
  finally
  {
    const dt =  performance.now() - t0;
    registerPerf(name,dt);
  }

};


const wrapFunc = (resolvers, reporter, namePrefix="ROOT") => // resolvers
{
  const wrapped = {};

  Object.keys(resolvers).forEach((key) => {
    const resolver = resolvers[key];
    const name = getResolverName(namePrefix, key);

    if (typeof resolver === 'object') {
      wrapped[key] = wrapFunc(resolver, reporter, name);
    } else if (typeof resolver === 'function') {
      wrapped[key] = monitor(resolver, reporter, name);
    } else {
      wrapped[key] = resolver;
    }
  });

  return wrapped;
}
const wrapResolvers = (resolvers,) => {
  const config = {
    reporter: {},
  };

  const reporter = typeof config.reporter === 'function' ? config.reporter() : config.reporter;

  return wrapFunc(resolvers, reporter);
};

const server = armor.apolloServer({
  typeDefs,
  resolvers:wrapResolvers(resolvers) ,
  cache: 'bounded',
  // eslint-disable-next-line new-cap
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

(async () => {
  await server.start();
  server.applyMiddleware({
    app,
    path: '/',
  });

  await new Promise<void>((resolve) => {
    const x = httpServer.listen({ port: 4000 }, resolve);
  });

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})();
