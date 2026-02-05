import jwt from 'jsonwebtoken';
import { getAuthProvider } from '@src/services/auth/auth-provider.factory.js';
import { assertJwtConfig, getJwtSignKey, getJwtSignOptions } from '@src/services/auth/jwt.utils.js';

assertJwtConfig();

export async function authenticateWithProvider(params: {
  email: string;
  password: string;
}) {
  const provider = getAuthProvider();
  return provider.authenticate(params);
}

export function generateAccessToken(payload: {
  user_id: string;
  email: string;
  status: string;
  modules: string[];
  ad_object_id?: string | null;
}) {
  const options = getJwtSignOptions();
  const token = jwt.sign(payload, getJwtSignKey(), options);
  return { token, expiresIn: typeof options.expiresIn === 'number' ? options.expiresIn : 0 };
}
