import type { GraphQLError, ValidationContext } from 'graphql';

export type GraphQLArmorAcceptCallback = (ctx: ValidationContext, details: any) => void;
export type GraphQLArmorRejectCallback = (ctx: ValidationContext, error: GraphQLError) => void;
export type GraphQLArmorCallbackConfiguration = {
  onAccept?: GraphQLArmorAcceptCallback[];
  onReject?: GraphQLArmorRejectCallback[];
  throwRejection?: boolean;
};
