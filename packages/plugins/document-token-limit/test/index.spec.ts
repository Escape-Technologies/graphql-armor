import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { describe, expect, it } from '@jest/globals';
import { buildSchema } from 'graphql';

import { documentTokenLimitDefaultOptions, documentTokenLimitPlugin } from '../src/index';

const schema = buildSchema(/* GraphQL */ `
  type Query {
    a: String
  }
`);

describe('global', () => {
  it('should be defined', () => {
    expect(documentTokenLimitPlugin).toBeDefined();

    documentTokenLimitPlugin();
    documentTokenLimitPlugin({});
    documentTokenLimitPlugin({ maxTokenCount: 1 });
  });

  it('rejects an operation with more than the default max token count', async () => {
    const operation = `{ ${Array(documentTokenLimitDefaultOptions.maxTokenCount).join('a ')} }`;
    const testkit = createTestkit([documentTokenLimitPlugin()], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual('Syntax Error: Token limit of 2000 exceeded.');
  });
  it('does not rejects an oepration below the max token count', async () => {
    const operation = `{ ${Array(documentTokenLimitDefaultOptions.maxTokenCount - 2).join('a ')} }`;
    const testkit = createTestkit([documentTokenLimitPlugin()], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
  });
  it('rejects an operation with more than the default max token count (user provided)', async () => {
    const count = 4;
    const operation = `{ ${Array(count).join('a ')} }`;
    const testkit = createTestkit([documentTokenLimitPlugin({ maxTokenCount: 4 })], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].message).toEqual('Syntax Error: Token limit of 4 exceeded.');
  });
  it('does not rejects an oepration below the max token count (user provided)', async () => {
    const count = 4;
    const operation = `{ ${Array(count - 2).join('a ')} }`;
    const testkit = createTestkit([documentTokenLimitPlugin({ maxTokenCount: 4 })], schema);
    const result = await testkit.execute(operation);
    assertSingleExecutionValue(result);
    expect(result.errors).toBeUndefined();
  });
});
