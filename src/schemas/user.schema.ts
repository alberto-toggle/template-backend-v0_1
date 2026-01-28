export const createUserBodySchema = {
  $id: 'CreateUserBody',
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 1 }
  },
  required: ['email', 'name'],
  additionalProperties: false
} as const;

export const userIdParamsSchema = {
  $id: 'UserIdParams',
  type: 'object',
  properties: {
    id: { type: 'integer', minimum: 1 }
  },
  required: ['id'],
  additionalProperties: false
} as const;
