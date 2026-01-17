import { Plugin } from '@envelop/types';
import type { GraphQLArmorCallbackConfiguration } from '@escape.tech/graphql-armor-types';
import { GraphQLError, Source, TokenKind } from 'graphql';
import { ParseOptions, Parser } from 'graphql/language/parser';

type maxTokensParserWLexerOptions = ParseOptions & {
  n: number;
  exposeLimits?: boolean;
  errorMessage?: string;
} & GraphQLArmorCallbackConfiguration;

export type MaxTokensOptions = {
  /**
   * Tokens threshold.
   * @default 1000
   */
  n?: number;
  /**
   * If this is set to `true`, details about the configured limit are included in the GraphQLError message when errors occur.
   *
   * When set to `false` {@link MaxTokensOptions.errorMessage} is used as the GraphQLError message.
   * @default true
   */
  exposeLimits?: boolean;
  /**
   * The error message used when {@link MaxTokensOptions.exposeLimits} is set to `true`.
   * @default 'Query validation error.'
   */
  errorMessage?: string;
} & GraphQLArmorCallbackConfiguration;

export const maxTokenDefaultOptions: Required<MaxTokensOptions> = {
  n: 1000,
  exposeLimits: true,
  errorMessage: 'Query validation error.',
  onAccept: [],
  onReject: [],
  propagateOnRejection: true,
};

export class MaxTokensParserWLexer extends Parser {
  private _tokenCount = 0;
  private readonly config: Required<MaxTokensOptions>;

  get tokenCount() {
    return this._tokenCount;
  }

  constructor(source: string | Source, options?: maxTokensParserWLexerOptions) {
    super(source, options);

    this.config = Object.assign(
      {},
      maxTokenDefaultOptions,
      ...Object.entries(options ?? {}).map(([k, v]) => (v === undefined ? {} : { [k]: v })),
    );

    const lexer = this._lexer;
    this._lexer = new Proxy(lexer, {
      get: (target, prop, receiver) => {
        if (prop === 'advance') {
          return () => {
            const token = target.advance();
            if (token.kind !== TokenKind.EOF) {
              this._tokenCount++;
            }

            if (this._tokenCount > this.config.n) {
              const message = this.config.exposeLimits
                ? `Token limit of ${this.config.n} exceeded.`
                : this.config.errorMessage;
              const err = new GraphQLError(`Syntax Error: ${message}`);

              for (const handler of this.config.onReject) {
                handler(null, err);
              }

              if (this.config.propagateOnRejection) {
                throw err;
              }
            }

            for (const handler of this.config.onAccept) {
              handler(null, { n: this._tokenCount });
            }
            return token;
          };
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }
}

/**
 * Limit the number of tokens in a GraphQL document.
 *
 * It is used to prevent DOS attack, heap overflow or server overloading.
 *
 * The token limit is often limited by the graphql parser, but this is not always the case and would lead to a fatal heap overflow.
 *
 * Use with `@envelop/core` from `@the-guild-org`.
 */
export function maxTokensPlugin<PluginContext extends Record<string, any> = {}>(
  config?: MaxTokensOptions,
): Plugin<PluginContext> {
  function parseWithTokenLimit(source: string | Source, options?: ParseOptions) {
    // @ts-expect-error TODO(@c3b5aw): address the type issue
    const parser = new MaxTokensParserWLexer(source, Object.assign({}, options, config));
    return parser.parseDocument();
  }
  return {
    onParse({ setParseFn }) {
      setParseFn(parseWithTokenLimit);
    },
  };
}
