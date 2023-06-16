import { Plugin } from '@envelop/types';
import type { GraphQLArmorCallbackConfiguration } from '@escape.tech/graphql-armor-types';
import { Source, TokenKind } from 'graphql';
import { syntaxError } from 'graphql/error';
import { ParseOptions, Parser } from 'graphql/language/parser';

type maxTokensParserWLexerOptions = ParseOptions & {
  n: number;
} & GraphQLArmorCallbackConfiguration;

export type MaxTokensOptions = { n?: number } & GraphQLArmorCallbackConfiguration;
export const maxTokenDefaultOptions: Required<MaxTokensOptions> = {
  n: 1000,
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
              const err = syntaxError(
                this._lexer.source,
                token.start,
                `Token limit of ${this.config.n} exceeded.`,
              );

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

export function maxTokensPlugin(config?: MaxTokensOptions): Plugin {
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
