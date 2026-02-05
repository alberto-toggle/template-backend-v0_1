export const createUserBodySchema = {
  $id: 'CreateUserBody',
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    adObjectId: { type: ['string', 'null'] },
    status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] }
  },
  required: ['email'],
  additionalProperties: false
} as const;

export const userIdParamsSchema = {
  $id: 'UserIdParams',
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' }
  },
  required: ['id'],
  additionalProperties: false
} as const;
