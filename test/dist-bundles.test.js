/**
 * Smoke-tests the built distribution bundles (what consumers actually
 * install) against the workspace graphql version, including the callback
 * surface of every protection. These artifacts are produced by preconstruct
 * (`yarn build`), so run after a build.
 */
const { buildSchema } = require('graphql');
const { createTestkit } = require('@envelop/testing');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const maxAliases = require('../packages/plugins/max-aliases/dist/graphql-armor-max-aliases.cjs.dev.js');
const maxDepth = require('../packages/plugins/max-depth/dist/graphql-armor-max-depth.cjs.dev.js');
const maxDirectives = require('../packages/plugins/max-directives/dist/graphql-armor-max-directives.cjs.dev.js');
const maxTokens = require('../packages/plugins/max-tokens/dist/graphql-armor-max-tokens.cjs.dev.js');
const costLimit = require('../packages/plugins/cost-limit/dist/graphql-armor-cost-limit.cjs.dev.js');
const characterLimit = require('../packages/plugins/character-limit/dist/graphql-armor-character-limit.cjs.dev.js');
const blockFieldSuggestions = require('../packages/plugins/block-field-suggestions/dist/graphql-armor-block-field-suggestions.cjs.dev.js');
const { EnvelopArmorPlugin } = require('../packages/graphql-armor/dist/graphql-armor.cjs.dev.js');

const typeDefs = `
  type Book { title: String author: Author }
  type Author { name: String }
  type Query { books: [Book] authors: [Author] }
`;
const resolvers = {
  Query: {
    books: () => [{ title: 'The Awakening', author: { name: 'Kate Chopin' } }],
    authors: () => [{ name: 'Kate Chopin' }],
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const buildOnlySchema = () => buildSchema(typeDefs);

const deep = (n) => {
  let q = 'query { books';
  for (let i = 0; i < n; i++) {
    q += ' { author { books';
  }
  q += ' { title }';
  q += ' }'.repeat(2 * n + 1);
  return q;
};

describe('built bundles', () => {
  test.each([
    [
      'maxAliasesPlugin',
      (o) => maxAliases.maxAliasesPlugin({ n: 2, ...o }),
      '{ books { title } }',
      '{ a: books { title } b: books { title } c: books { title } }',
      /Aliases limit of 2 exceeded/,
    ],
    [
      'maxDepthPlugin',
      (o) => maxDepth.maxDepthPlugin({ n: 4, ...o }),
      '{ books { title } }',
      deep(4),
      /depth limit of 4 exceeded/,
    ],
    [
      'maxDirectivesPlugin',
      (o) => maxDirectives.maxDirectivesPlugin({ n: 3, ...o }),
      '{ books { title } }',
      '{ books @include(if: true) @include(if: true) @include(if: true) @include(if: true) { title } }',
      /Directives limit of 3 exceeded/,
    ],
    [
      'maxTokensPlugin',
      (o) => maxTokens.maxTokensPlugin({ n: 20, ...o }),
      '{ books { title } }',
      '{ ' + 'a '.repeat(25) + '}',
      /Token limit of 20 exceeded/,
    ],
    [
      'costLimitPlugin',
      (o) => costLimit.costLimitPlugin({ maxCost: 50, ...o }),
      '{ books { title } }',
      deep(8),
      /Cost limit of 50 exceeded/,
    ],
    [
      'characterLimitPlugin',
      (o) => characterLimit.characterLimitPlugin({ maxLength: 50, ...o }),
      '{ books { title } }',
      '{ ' + 'a '.repeat(40) + '}',
      /Character limit of 50 exceeded/,
    ],
  ])('%s accepts valid and rejects abusive queries with callbacks', async (_name, plugin, accept, reject, expected) => {
    const rejections = [];
    const acceptances = [];
    const testkit = createTestkit(
      [
        plugin({
          onReject: [
            (_ctx, err) => {
              rejections.push(err.message);
            },
          ],
          onAccept: [
            () => {
              acceptances.push(true);
            },
          ],
        }),
      ],
      schema,
    );

    const ok = await testkit.execute(accept);
    expect(ok.errors).toBeUndefined();

    const bad = await testkit.execute(reject);
    expect(bad.errors?.some((e) => expected.test(e.message))).toBe(true);
    expect(rejections.some((m) => expected.test(m))).toBe(true);
    expect(acceptances).toHaveLength(1);
  });

  it('blockFieldSuggestionsPlugin masks suggestions', async () => {
    const testkit = createTestkit([blockFieldSuggestions.blockFieldSuggestionsPlugin()], schema);
    const bad = await testkit.execute('{ books { titlee } }');
    expect(bad.errors?.some((e) => e.message.includes('[Suggestion hidden]'))).toBe(true);
  });

  it('EnvelopArmorPlugin runs with the bundled default configuration', async () => {
    const testkit = createTestkit([EnvelopArmorPlugin()], schema);
    const ok = await testkit.execute('{ books { title } }');
    expect(ok.errors).toBeUndefined();

    const bad = await testkit.execute(deep(10));
    expect(bad.errors?.length).toBeGreaterThan(0);
  });

  it('plugins keep working with a schema built by graphql buildSchema', () => {
    // Regression guard: schema instances must stay compatible with the
    // installed graphql (single copy, same major).
    const testkit = createTestkit([maxDepth.maxDepthPlugin({ n: 1 })], buildOnlySchema());
    return Promise.resolve(testkit.execute('{ books { title } }')).then((result) => {
      expect(result.errors?.some((e) => /depth limit of 1 exceeded/.test(e.message))).toBe(true);
    });
  });
});
