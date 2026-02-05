import type { Algorithm, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { env } from '@src/config/env.js';

const SYMMETRIC_ALGS = new Set<Algorithm>(['HS256', 'HS384', 'HS512']);

function normalizeOptional(value: string | undefined) {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getJwtIssuer() {
  return normalizeOptional(env.JWT_ISSUER);
}

export function getJwtAudience() {
  return normalizeOptional(env.JWT_AUDIENCE);
}

export function getJwtAlgorithm(): Algorithm {
  return env.JWT_ALGORITHM as Algorithm;
}

export function getJwtSignKey(): string {
  const alg = getJwtAlgorithm();
  if (SYMMETRIC_ALGS.has(alg)) {
    if (!env.JWT_SECRET || env.JWT_SECRET.trim().length === 0) {
      throw new Error('JWT_SECRET is required for symmetric algorithms');
    }
    return env.JWT_SECRET;
  }

  if (!env.JWT_PRIVATE_KEY || env.JWT_PRIVATE_KEY.trim().length === 0) {
    throw new Error('JWT_PRIVATE_KEY is required for asymmetric algorithms');
  }

  return env.JWT_PRIVATE_KEY;
}

export function getJwtVerifyKey(): string {
  const alg = getJwtAlgorithm();
  if (SYMMETRIC_ALGS.has(alg)) {
    if (!env.JWT_SECRET || env.JWT_SECRET.trim().length === 0) {
      throw new Error('JWT_SECRET is required for symmetric algorithms');
    }
    return env.JWT_SECRET;
  }

  if (!env.JWT_PUBLIC_KEY || env.JWT_PUBLIC_KEY.trim().length === 0) {
    throw new Error('JWT_PUBLIC_KEY is required for asymmetric algorithms');
  }

  return env.JWT_PUBLIC_KEY;
}

export function getJwtSignOptions(): SignOptions {
  const issuer = getJwtIssuer();
  const audience = getJwtAudience();
  const options: SignOptions = {
    algorithm: getJwtAlgorithm(),
    expiresIn: env.JWT_EXPIRES_IN
  };

  if (issuer) options.issuer = issuer;
  if (audience) options.audience = audience;

  return options;
}

export function getJwtVerifyOptions(): VerifyOptions {
  const issuer = getJwtIssuer();
  const audience = getJwtAudience();
  const options: VerifyOptions = {
    algorithms: [getJwtAlgorithm()],
    clockTolerance: env.JWT_CLOCK_SKEW_SECONDS
  };

  if (issuer) options.issuer = issuer;
  if (audience) options.audience = audience;

  return options;
}

export function assertJwtConfig() {
  getJwtSignKey();
  getJwtVerifyKey();
}
