import { Plugin } from '@envelop/types';
import { GraphQLError, Source, TokenKind } from 'graphql';
import { ParseOptions, Parser } from 'graphql/language/parser';

type maxTokensParserWLexerOptions = ParseOptions & {
  n: number;
};
class MaxTokensParserWLexer extends Parser {
  private _tokenCount = 0;

  get tokenCount() {
    return this._tokenCount;
  }

  constructor(source: string | Source, options: maxTokensParserWLexerOptions) {
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

            if (this._tokenCount > options.n) {
              throw new GraphQLError(`Syntax Error: Token limit of ${options.n} exceeded, found ${this._tokenCount}.`, {
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

  // new ParserWithLexer(context.source, { ...options, n: options?.n ?? maxTokenDefaultOptions.n });
type MaxTokensOptions = { n?: number };
const maxTokenDefaultOptions: Required<MaxTokensOptions> = {
  n: 1000,
};

function maxTokensPlugin(options?: MaxTokensOptions): Plugin {
  const maxTokenCount = options?.n ?? maxTokenDefaultOptions.n;

  function parseWithTokenLimit(source: string | Source, options?: ParseOptions) {
    const parser = new MaxTokensParserWLexer(source, { ...options, n: maxTokenCount });
    return parser.parseDocument();
  }
  return {
    onParse({ setParseFn }) {
      setParseFn(parseWithTokenLimit);
    },
  };
}

export { MaxTokensOptions, maxTokenDefaultOptions, maxTokensPlugin, MaxTokensParserWLexer };
