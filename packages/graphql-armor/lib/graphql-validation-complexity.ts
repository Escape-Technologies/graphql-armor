import {GraphQLList, GraphQLNonNull, GraphQLObjectType, ValidationContext} from 'graphql';
import {print} from 'graphql/language/printer';
import * as IntrospectionTypes from 'graphql/type/introspection';

const fs = require('fs');

/*
Original code
https://github.com/4Catalyzer/graphql-validation-complexity
31 Aug 2020
by 4Catalyzer
 */


// -- code vendored from: https://github.com/graphql/graphql-js/blob/15.x.x/src/validation/rules/OverlappingFieldsCanBeMerged.js#L636-L657
function isSameArguments(arguments1, arguments2) {
    if (!arguments1 || !arguments2) return false;
    if (arguments1.length !== arguments2.length) {
        return false;
    }
    return arguments1.every((argument1) => {
        const argument2 = arguments2.find(
            ({name}) => name.value === argument1.name.value,
        );

        if (!argument2) {
            return false;
        }

        return print(argument1.value) === print(argument2.value);
    });
}

// ---

function isSameInlineFragment(selection1, selection2) {
    return (
        selection1.kind === 'InlineFragment' &&
        selection1.typeCondition.name.value === selection2.typeCondition.name.value
    );
}

function isSameSelection(selection1, selection2) {
    return (
        selection1.kind === selection2.kind &&
        selection1.name?.value === selection2.name?.value &&
        (isSameInlineFragment(selection1, selection2) ||
            isSameArguments(selection1.arguments, selection2.arguments))
    );
}

function uniqSelections(selections) {
    const results: any[] = [];
    for (const selection of selections) {
        const other = results.find((s) => isSameSelection(selection, s));
        if (!other) {
            // clone nodes with selections to avoid mutating the original AST below

            results.push(selection.selectionSet ? {...selection} : selection);
            continue;
        }

        const {selectionSet} = other;
        if (selectionSet) {
            // merge nested selections they will be deduped later on
            other.selectionSet = {
                ...selectionSet,
                selections: [
                    ...selectionSet.selections,
                    ...selection.selectionSet.selections,
                ],
            };
        }
    }
    return results;
}

export default class ComplexityVisitor {
    private context: any;
    private readonly scalarCost: number;
    private readonly objectCost: number;
    private readonly listFactor: number;
    private readonly depthFactor: number;
    private readonly introspectionListFactor: number;
    private costFactor: number;
    private cost: number;
    private Field: any;
    private FragmentDefinition: () => boolean;
    private SelectionSet: (selectionSet) => any;
    private path: string[] = [];
    private readonly ignoreIntrospection: boolean = true;
    private isIntrospectionQuery = false; // this is not config ! leave it to false.
    constructor(
        context: ValidationContext,
        options: { scalarCost: number; objectCost: number; listFactor: number; introspectionListFactor: number; depthFactor:number; },
    ) {
        this.context = context;

        this.scalarCost = options.scalarCost;
        this.objectCost = options.objectCost;
        this.listFactor = options.listFactor;
        this.depthFactor = options.depthFactor;
        this.introspectionListFactor = options.introspectionListFactor;

        this.costFactor = 1;
        this.cost = 0;

        this.Field = {
            enter: this.enterField,
            leave: this.leaveField,
        };
        this.FragmentDefinition = () => {
            // don't visit any further we will include these at the spread location
            // (???)
            return false;
        };

        this.SelectionSet = this.flattenFragmentSpreads;
    }

    flattenFragmentSpreads(selectionSet) {
        const nextSelections = selectionSet.selections.flatMap((node) => {
            if (node.kind === 'FragmentSpread') {
                const fragment = this.context.getFragment(node.name.value);

                if (!fragment) return [];
                return this.flattenFragmentSpreads(fragment.selectionSet).selections;
            }

            return node;
        });

        return {
            ...selectionSet,
            selections: uniqSelections(nextSelections),
        };
    }

    enterField(obj) {
        this.path.push(obj.name.value);
        this.costFactor *= this.getFieldCostFactor();

        // If we decide to disable the cost of introspection queries
        // And we are entering or already inside an introspection request
        // Then the function should return here (cost += 0)
        if (this.ignoreIntrospection && (obj.name.value === "__schema" || this.isIntrospectionQuery)) {
            this.isIntrospectionQuery = true;
            return;
        }

        this.cost += this.costFactor * this.getFieldCost();

    }

    leaveField(obj) {

        if (this.path[this.path.length - 1] !== obj.name.value)
            throw Error("error; shouldn't happen"); // TODO : pas d'erreur + plus explicite?

        this.path.pop();

        if (this.ignoreIntrospection && obj.name.value === "__schema") {
            this.isIntrospectionQuery = false;
        }

        this.costFactor /= this.getFieldCostFactor();
    }

    getFieldCostFactor() {
        const fieldDef = this.context.getFieldDef();
        if (fieldDef?.extensions?.getCostFactor) {
            return fieldDef.extensions.getCostFactor();
        }

        const directiveCostFactor = this.getDirectiveValue('costFactor');
        if (directiveCostFactor != null) {
            return directiveCostFactor;
        }
        const costFactor = this.getTypeCostFactor(this.context.getType());
        return costFactor;
    }

    getTypeCostFactor(type) {
        if (type instanceof GraphQLNonNull) {
            return this.getTypeCostFactor(type.ofType);
        }

        if (type instanceof GraphQLList) {
            const typeListFactor = this.isIntrospectionList(type)
                ? this.introspectionListFactor
                : this.listFactor;
            return typeListFactor * this.getTypeCostFactor(type.ofType);
        }

        return this.depthFactor;
    }

    isIntrospectionList({ofType}) {
        let type = ofType;
        if (type instanceof GraphQLNonNull) {
            type = type.ofType;
        }

        return IntrospectionTypes[type.name] === type;
    }

    getFieldCost() {
        const fieldDef = this.context.getFieldDef();
        if (fieldDef?.extensions?.getCost) {
            return fieldDef.extensions.getCost();
        }

        const directiveCost = this.getDirectiveValue('cost');
        if (directiveCost != null) {
            return directiveCost;
        }

        return this.getTypeCost(this.context.getType());
    }

    getTypeCost(type) {
        if (type instanceof GraphQLNonNull || type instanceof GraphQLList) {
            return this.getTypeCost(type.ofType);
        }

        return type instanceof GraphQLObjectType
            ? this.objectCost
            : this.scalarCost;
    }

    getDirectiveValue(directiveName) {
        const fieldDef = this.context.getFieldDef();
        if (!fieldDef?.astNode?.directives) {
            return null;
        }

        const directive = fieldDef.astNode.directives.find(
            ({name}) => name.value === directiveName,
        );
        if (!directive) {
            return null;
        }

        const valueArgument = directive.arguments.find(
            (argument) => argument.name.value === 'value',
        );

        if (!valueArgument) {
            const fieldName = fieldDef.name;
            const parentTypeName = this.context.getParentType().name;

            throw new Error(
                `No \`value\` argument defined in \`@${directiveName}\` directive ` +
                `on \`${fieldName}\` field on \`${parentTypeName}\`.`,
            );
        }

        return parseFloat(valueArgument.value.value);
    }

    getCost() {
        return this.cost;
    }
}