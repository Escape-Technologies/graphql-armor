import type { GraphQLError, ValidationContext } from 'graphql';

export type GraphQLArmorAcceptCallback = (ctx: ValidationContext | null, details: any) => void;
export type GraphQLArmorRejectCallback = (ctx: ValidationContext | null, error: GraphQLError) => void;
export type GraphQLArmorCallbackConfiguration = {
  onAccept?: GraphQLArmorAcceptCallback[];
  onReject?: GraphQLArmorRejectCallback[];
  propagateOnRejection?: boolean;
};
