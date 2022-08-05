import {
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  InlineFragmentNode,
  OperationDefinitionNode,
  ValidationContext,
} from 'graphql';
import { MaxDepthOptions, MaxDirectivesOptions } from '../config';

class MaxDirectivesVisitor {
  public readonly OperationDefinition: Record<string, any>;

  private readonly context: ValidationContext;
  private readonly options: MaxDirectivesOptions;
  private readonly onError: (msg: string) => any;

  constructor(context: ValidationContext, options: MaxDirectivesOptions, onError: (msg: string) => any) {
    this.context = context;
    this.options = options;
    this.onError = onError;

    this.OperationDefinition = {
      enter: this.onOperationDefinitionEnter,
    };
  }

  onOperationDefinitionEnter(operation: OperationDefinitionNode): void {
    const directives = this.countDirectives(operation);
    if (directives > this.options.n) {
      this.onError('Too many directives.');
    }
  }

  private countDirectives(
    node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode | FragmentSpreadNode,
  ): number {
    let directives = 0;
    if (node.directives) {
      directives += node.directives.length;
    }
    if ('selectionSet' in node && node.selectionSet) {
      for (let child of node.selectionSet.selections) {
        directives += this.countDirectives(child);
      }
    }
    return directives;
  }
}

export const maxDirectivesRule =
  (options: MaxDepthOptions, onError: (msg: string) => any) => (context: ValidationContext) =>
    new MaxDirectivesVisitor(context, options, onError);
