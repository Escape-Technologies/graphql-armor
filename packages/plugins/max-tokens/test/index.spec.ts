import type { Plugin } from '@envelop/types';
import { assertSingleExecutionValue, createTestkit } from '@envelop/testing';
import { describe, expect, it, jest } from '@jest/globals';
import { buildSchema, Kind, Source } from 'graphql';

import { MaxTokensParserWLexer, maxTokenDefaultOptions, maxTokensPlugin } from '../src/index';

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

describe('MaxTokensParserWLexer callbacks', () => {
  it('fires onReject once and skips onAccept when the limit is exceeded and propagateOnRejection is false', () => {
    const accepts: number[] = [];
    const rejects: string[] = [];

    const document = new MaxTokensParserWLexer(new Source('{ a b c d e f g h }'), {
      n: 2,
      propagateOnRejection: false,
      onAccept: [(_context, details: { n: number }) => accepts.push(details.n)],
      onReject: [(_context, error) => rejects.push(error.message)],
    }).parseDocument();

    expect(document.kind).toBe(Kind.DOCUMENT);
    expect(accepts).toEqual([]);
    expect(rejects).toEqual(['Syntax Error: Token limit of 2 exceeded.']);
  });

  it('fires onAccept once with the final token count when the operation is under the limit', () => {
    const accepts: number[] = [];
    const rejects: string[] = [];

    const document = new MaxTokensParserWLexer(new Source('{ a b }'), {
      n: 100,
      onAccept: [(_context, details: { n: number }) => accepts.push(details.n)],
      onReject: [(_context, error) => rejects.push(error.message)],
    }).parseDocument();

    expect(document.kind).toBe(Kind.DOCUMENT);
    expect(accepts).toEqual([4]);
    expect(rejects).toEqual([]);
  });

  it('throws once and does not call onAccept when propagateOnRejection is true', () => {
    const accepts: number[] = [];
    const rejects: string[] = [];

    expect(() => {
      new MaxTokensParserWLexer(new Source('{ a b c d e f g h }'), {
        n: 2,
        onAccept: [(_context, details: { n: number }) => accepts.push(details.n)],
        onReject: [(_context, error) => rejects.push(error.message)],
      }).parseDocument();
    }).toThrow('Syntax Error: Token limit of 2 exceeded.');

    expect(accepts).toEqual([]);
    expect(rejects).toEqual(['Syntax Error: Token limit of 2 exceeded.']);
  });
});
