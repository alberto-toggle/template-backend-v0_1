import type { AuthProvider, AuthProviderResult } from '@src/services/auth/auth-provider.js';

export class MockAuthProvider implements AuthProvider {
  constructor(private readonly mode: 'mock_allow' | 'mock_deny') {}

  async authenticate(params: { email: string; password: string }): Promise<AuthProviderResult> {
    const email = params.email.trim().toLowerCase();
    if (this.mode === 'mock_deny') {
      return { ok: false };
    }

    return {
      ok: true,
      email,
      external_user_id: null,
      ad_object_id: null
    };
  }
}
