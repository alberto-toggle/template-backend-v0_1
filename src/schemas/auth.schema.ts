export const authLoginBodySchema = {
  $id: 'AuthLoginBody',
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 1 }
  },
  required: ['email', 'password'],
  additionalProperties: false
} as const;
