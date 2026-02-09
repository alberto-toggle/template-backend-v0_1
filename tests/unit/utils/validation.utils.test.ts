import { validateWithAjv } from '@src/utils/validation.utils.js';

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 }
  },
  required: ['name'],
  additionalProperties: false
};

test('validateWithAjv validates schema and data', () => {
  const validResult = validateWithAjv(schema, { name: 'Ok' });
  expect(validResult.success).toBe(true);
  expect(validResult.data).toEqual({ name: 'Ok' });

  const invalidResult = validateWithAjv(schema, { name: '' });
  expect(invalidResult.success).toBe(false);
  expect(invalidResult.errors?.length).toBeGreaterThan(0);
});
