import type { AuthProvider } from "../../src/auth/dto/auth.dto";
import type { OAuthProfile } from "../../src/auth/oauth-provider.service";

/**
 * Deterministic stand-in for the network-backed OAuth exchange. Shared by the
 * auth/sync unit specs and the e2e suite so no test path ever hits the network.
 */
export class StubOAuthProviderService {
  async exchange(provider: AuthProvider | string): Promise<OAuthProfile> {
    return {
      providerAccountId: `${provider}-account`,
      email: `${provider}-user@example.com`,
      displayName: `${provider} user`,
    };
  }
}
