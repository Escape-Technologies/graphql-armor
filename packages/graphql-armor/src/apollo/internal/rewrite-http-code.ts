import { ApolloProtection, ApolloServerConfigurationEnhancement } from '../protections/base-protection';

const plugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ response }: { response: any }) {
        if (response?.errors?.[0]?.extensions?.code === 'BAD_USER_INPUT') {
          response.http.status = 400;
        }
      },
    };
  },
};

export class ApolloRewriteHTTPCode extends ApolloProtection {
  get isEnabled(): boolean {
    if (!this.config.rewriteHttpCode) {
      return this.enabledByDefault;
    }
    return this.config.rewriteHttpCode.enabled ?? this.enabledByDefault;
  }

  protect(): ApolloServerConfigurationEnhancement {
    return {
      plugins: [plugin],
    };
  }
}
