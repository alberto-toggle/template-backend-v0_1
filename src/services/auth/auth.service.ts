import jwt from 'jsonwebtoken';
import { env } from '@src/config/env.js';

export type ExternalAuthResult = {
  ok: boolean;
  reason?: 'INVALID_CREDENTIALS';
};

export async function validateExternalCredentials(
  _email: string,
  _password: string
): Promise<ExternalAuthResult> {
  // Stub/mock controlled by env until Cognito/ADFS is integrated.
  switch (env.AUTH_EXTERNAL_MODE) {
    case 'mock_deny':
      return { ok: false, reason: 'INVALID_CREDENTIALS' };
    case 'mock_allow':
    default:
      return { ok: true };
  }
}

export function generateAccessToken(payload: {
  user_id: string;
  email: string;
  status: string;
  modules: string[];
  ad_object_id?: string | null;
}) {
  const expiresIn = env.JWT_EXPIRES_IN;
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn });
  return { token, expiresIn };
}
