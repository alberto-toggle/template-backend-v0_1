import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import path from 'path';
import { fileURLToPath } from 'url';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'prisma/', 'configuration/', 'scripts/', 'environment/']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.cjs'],
    languageOptions: {
      globals: { ...globals.node }
    }
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
        sourceType: 'module'
      }
    },
    plugins: {
      import: importPlugin
    },
    rules: {
      'import/order': [
        'warn',
        {
          'newlines-between': 'always'
        }
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
];
