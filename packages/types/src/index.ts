import type { Plugin } from '@envelop/types';
import type { GraphQLError, ValidationContext } from 'graphql';

export type GraphQLArmorAcceptCallback = (ctx: ValidationContext | null, details: any) => void;
export type GraphQLArmorRejectCallback = (ctx: ValidationContext | null, error: GraphQLError) => void;
export type GraphQLArmorCallbackConfiguration = {
  onAccept?: GraphQLArmorAcceptCallback[];
  onReject?: GraphQLArmorRejectCallback[];
  propagateOnRejection?: boolean;
};

export type GraphQLArmorValidateConfiguration<PluginContext extends Record<string, unknown>> = {
  enabled?:
    | boolean
    | ((args: {
        context: PluginContext;
        params: Parameters<NonNullable<Plugin['onValidate']>>[0]['params'];
      }) => boolean);
};

export type GraphQLArmorParseConfiguration<PluginContext extends Record<string, unknown>> = {
  enabled?:
    | boolean
    | ((args: { context: PluginContext; params: Parameters<NonNullable<Plugin['onParse']>>[0]['params'] }) => boolean);
};
