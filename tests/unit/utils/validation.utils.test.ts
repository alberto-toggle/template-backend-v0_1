import { validateWithAjv } from '../../../src/utils/validation.utils.js';

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
  expect(validResult.valid).toBe(true);

  const invalidResult = validateWithAjv(schema, { name: '' });
  expect(invalidResult.valid).toBe(false);
  expect(invalidResult.errors.length).toBeGreaterThan(0);
});
