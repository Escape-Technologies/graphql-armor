import { Plugin } from '@envelop/types';
import { GraphQLError, Source, TokenKind } from 'graphql';
import { ParseOptions, Parser } from 'graphql/language/parser';

type ParserWithLexerOptions = ParseOptions & {
  tokenLimit: number;
};

class ParserWithLexer extends Parser {
  private _tokenCount = 0;

  get tokenCount() {
    return this._tokenCount;
  }

  constructor(source: string | Source, options: ParserWithLexerOptions) {
    super(source, options);
    const lexer = this._lexer;
    this._lexer = new Proxy(lexer, {
      get: (target, prop, receiver) => {
        if (prop === 'advance') {
          return () => {
            const token = target.advance();
            if (token.kind !== TokenKind.EOF) {
              this._tokenCount++;
            }

            if (this._tokenCount > options.tokenLimit) {
              throw new GraphQLError(`Syntax Error: Token limit of ${options.tokenLimit} exceeded.`, {
                source: this._lexer.source,
                positions: [token.start],
              });
            }
            return token;
          };
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }
}

type DocumentTokenLimitOptions = { maxTokenCount?: number };
export const documentTokenLimitDefaultOptions: Required<DocumentTokenLimitOptions> = {
  maxTokenCount: 2000,
};

export function documentTokenLimitPlugin(options?: DocumentTokenLimitOptions): Plugin {
  const maxTokenCount = options?.maxTokenCount ?? documentTokenLimitDefaultOptions.maxTokenCount;

  function parseWithTokenLimit(source: string | Source, options?: ParseOptions) {
    const parser = new ParserWithLexer(source, { ...options, tokenLimit: maxTokenCount });
    return parser.parseDocument();
  }
  return {
    onParse({ setParseFn }) {
      setParseFn(parseWithTokenLimit);
    },
  };
}
