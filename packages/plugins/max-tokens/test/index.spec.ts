import type { Plugin } from '@envelop/types';
import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { describe, expect, it, jest } from '@jest/globals';
import { buildSchema } from 'graphql';

import { maxTokenDefaultOptions, maxTokensPlugin } from '../src/index';

// test checking if the plugin inherits the context correctly
const _test_0: Plugin = maxTokensPlugin();
const _test_1: Plugin<{ my: 'ctx' }> = maxTokensPlugin();

const schema = buildSchema(/* GraphQL */ `
  type Query {
    a: String
  }
`);

describe('maxTokensPlugin', () => {
  it('should be defined', () => {
    expect(maxTokensPlugin).toBeDefined();

    maxTokensPlugin();
    maxTokensPlugin({});
    maxTokensPlugin({ n: 1 });
  });

  it('rejects an operation with more than the default max token count', async () => {
    const operation = `{ ${Array(maxTokenDefaultOptions.n).fill('a').join(' ')} }`;
    const testkit = createTestkit([maxTokensPlugin()], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual(`Syntax Error: Token limit of ${maxTokenDefaultOptions.n} exceeded.`);
  });

  it('does not reject an operation below the max token count', async () => {
    const operation = `{ ${Array(maxTokenDefaultOptions.n - 2)
      .fill('a')
      .join(' ')} }`;
    const testkit = createTestkit([maxTokensPlugin()], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
  });

  it('rejects an operation with more than the user-provided max token count', async () => {
    const count = 4;
    const operation = `{ ${Array(count).fill('a').join(' ')} }`;
    const testkit = createTestkit([maxTokensPlugin({ n: count })], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual('Syntax Error: Token limit of 4 exceeded.');
  });

  it('does not reject an operation below the user-provided max token count', async () => {
    const count = 4;
    const operation = `{ ${Array(count - 2)
      .fill('a')
      .join(' ')} }`;
    const testkit = createTestkit([maxTokensPlugin({ n: count })], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
  });

  it('rejects with a generic error message when exposeLimits is false', async () => {
    const count = 5;
    const customMessage = 'Custom error message.';
    const operation = `{ ${Array(count).fill('a').join(' ')} }`;
    const testkit = createTestkit(
      [maxTokensPlugin({ n: count, exposeLimits: false, errorMessage: customMessage })],
      schema,
    );
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual(`Syntax Error: ${customMessage}`);
  });

  it('rejects with detailed error message when exposeLimits is true', async () => {
    const count = 5;
    const operation = `{ ${Array(count).fill('a').join(' ')} }`;
    const testkit = createTestkit([maxTokensPlugin({ n: count, exposeLimits: true })], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual(`Syntax Error: Token limit of ${count} exceeded.`);
  });
});
