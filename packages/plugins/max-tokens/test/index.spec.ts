import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { describe, expect, it } from '@jest/globals';
import { buildSchema } from 'graphql';

import { maxTokenDefaultOptions, maxTokensPlugin } from '../src/index';

const schema = buildSchema(/* GraphQL */ `
  type Query {
    a: String
  }
`);

describe('global', () => {
  it('should be defined', () => {
    expect(maxTokensPlugin).toBeDefined();

    maxTokensPlugin();
    maxTokensPlugin({});
    maxTokensPlugin({ n: 1 });
  });

  it('should works when enabled option returns false', async () => {
    const operation = `{ ${Array(maxTokenDefaultOptions.n).join('a ')} }`;
    const testkit = createTestkit([maxTokensPlugin({ enabled: () => false })], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
  });
  it('rejects an operation with more than the default max token count', async () => {
    const operation = `{ ${Array(maxTokenDefaultOptions.n).join('a ')} }`;
    const testkit = createTestkit([maxTokensPlugin()], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual(
      `Syntax Error: Token limit of ${maxTokenDefaultOptions.n} exceeded, found ${maxTokenDefaultOptions.n + 1}.`,
    );
  });
  it('does not rejects an oepration below the max token count', async () => {
    const operation = `{ ${Array(maxTokenDefaultOptions.n - 2).join('a ')} }`;
    const testkit = createTestkit([maxTokensPlugin()], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
  });
  it('rejects an operation with more than the default max token count (user provided)', async () => {
    const count = 4;
    const operation = `{ ${Array(count).join('a ')} }`;
    const testkit = createTestkit([maxTokensPlugin({ n: count })], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual('Syntax Error: Token limit of 4 exceeded, found 5.');
  });
  it('does not rejects an oepration below the max token count (user provided)', async () => {
    const count = 4;
    const operation = `{ ${Array(count - 2).join('a ')} }`;
    const testkit = createTestkit([maxTokensPlugin({ n: count })], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
  });
});
