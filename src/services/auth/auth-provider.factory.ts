import type { AuthProvider } from '@src/services/auth/auth-provider.js';
import { env } from '@src/config/env.js';
import { MockAuthProvider } from '@src/services/auth/providers/mock-auth.provider.js';

export function getAuthProvider(): AuthProvider {
  const mode = env.AUTH_EXTERNAL_MODE === 'mock_deny' ? 'mock_deny' : 'mock_allow';
  return new MockAuthProvider(mode);
}
