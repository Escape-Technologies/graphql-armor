// @ts-nocheck
import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, expect, it } from '@jest/globals';

import { EnvelopArmor, EnvelopArmorPlugin } from '../../src/envelop/armor';

describe('envelopArmor', () => {
  const envelop = new EnvelopArmor();

  it('should be defined', () => {
    expect(envelop).toBeDefined();
  });

  const enhancements = envelop.protect();
  it('should be defined', () => {
    expect(enhancements).toBeDefined();
  });

  it('should have property', () => {
    expect(enhancements).toHaveProperty('plugins');
  });

  it('should have property that equals', () => {
    expect(enhancements.plugins.length).toEqual(6);
  });
});

const typeDefinitions = /* GraphQL */ `
  type Author {
    name: String
    books: [Book]
  }

  type Book {
    title: String
    author: Author
  }

  type Query {
    books: [Book]
  }
`;
const books = [
  {
    title: 'The Awakening',
    author: { name: 'Kate Chopin' },
  },
  {
    title: 'City of Glass',
    author: { name: 'Paul Auster' },
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
  Author: {
    books: (author) => books.filter((book) => book.author === author.name),
  },
};

const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});

describe('envelopArmorPlugin', () => {
  it('should define our plugins', async () => {
    const maxDepth = 2;
    const testkit = createTestkit(
      [
        EnvelopArmorPlugin({
          maxDepth: {
            n: maxDepth,
          },
        }),
      ],
      schema,
    );
    const result = await testkit.execute(`query {
      books {
        title
        author {
          name
        }
      }
    }`);

    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors?.map((error) => error.message)).toEqual([
      `Syntax Error: Query depth limit of ${maxDepth} exceeded, found ${maxDepth + 1}.`,
    ]);
  });
});
