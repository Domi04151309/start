// @ts-expect-error
import arrayFunc from 'eslint-plugin-array-func';
// @ts-expect-error
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import globals from 'globals';
// @ts-expect-error
import imports from 'eslint-plugin-import';
import js from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
// @ts-expect-error
import promise from 'eslint-plugin-promise';
import sonarjs from 'eslint-plugin-sonarjs';
import stylistic from '@stylistic/eslint-plugin';
import ts from 'typescript-eslint';
import unicorn from 'eslint-plugin-unicorn';

/* eslint-disable @typescript-eslint/no-unsafe-argument */
export default ts.config(
  // General configuration.
  {
    ...js.configs.all,
    rules: {
      ...js.configs.all.rules,
      curly: ['error', 'multi', 'consistent'],
      'func-style': [
        'error',
        'declaration',
        {
          allowArrowFunctions: true
        }
      ],
      'id-length': [
        'error', {
          exceptions: ['_']
        }
      ],
      'init-declarations': 'off',
      'max-lines-per-function': 'off',
      'max-params': ['error', 5],
      'max-statements': ['error', 100],
      'no-console': [
        'error',
        {
          allow: ['warn', 'error']
        }
      ],
      'no-continue': 'off',
      'no-inline-comments': [
        'error',
        {
          ignorePattern: String.raw`@type\s.+|@ts-expect-error`
        }
      ],
      'no-loop-func': 'off',
      'no-magic-numbers': 'off',
      'no-plusplus': 'off',
      'no-ternary': 'off',
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_$'
        }
      ],
      'one-var': [
        'error',
        {
          initialized: 'never',
          uninitialized: 'always'
        }
      ]
    }
  },
  // Array func plugin configuration.
  {
    ...arrayFunc.configs.all,
    rules: {
      ...arrayFunc.configs.all.rules,
      'array-func/prefer-array-from': 'off'
    }
  },
  // Comments plugin configuration.
  {
    ...comments.recommended,
    rules: {
      ...comments.recommended.rules,
      '@eslint-community/eslint-comments/no-unused-disable': 'error'
    }
  },
  // Import plugin configuration.
  {
    ...imports.flatConfigs.recommended,
    rules: {
      ...imports.flatConfigs.recommended.rules,
      'import/no-unresolved': 'off'
    }
  },
  // Jsdoc plugin configuration.
  {
    ...jsdoc.configs['flat/recommended-error'],
    rules: {
      ...jsdoc.configs['flat/recommended-error'].rules,
      'jsdoc/no-undefined-types': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns-description': 'off'
    }
  },
  // Promise plugin configuration.
  {
    ...promise.configs['flat/recommended']
  },
  // Sonarjs plugin configuration.
  {
    ...sonarjs.configs.recommended,
    rules: {
      ...sonarjs.configs.recommended.rules,
      'sonarjs/assertions-in-tests': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-empty-function': 'off',
      'sonarjs/no-hardcoded-credentials': 'off',
      'sonarjs/no-hardcoded-passwords': 'off',
      'sonarjs/no-misused-promises': 'off',
      'sonarjs/pseudo-random': 'off',
      'sonarjs/redundant-type-aliases': 'off'
    }
  },
  // Stylistic plugin configuration.
  {
    ...stylistic.configs.all,
    rules: {
      ...stylistic.configs.all.rules,
      '@stylistic/array-element-newline': ['error', 'consistent'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/dot-location': ['error', 'property'],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-paren-newline': ['error', 'consistent'],
      '@stylistic/implicit-arrow-linebreak': 'error',
      '@stylistic/indent': ['error', 2],
      '@stylistic/indent-binary-ops': 'off',
      '@stylistic/lines-around-comment': [
        'error',
        {
          ignorePattern: String.raw`@type\s.+|@ts-expect-error`
        }
      ],
      '@stylistic/max-len': [
        'error',
        {
          ignoreComments: true
        }
      ],
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/no-confusing-arrow': 'off',
      '@stylistic/no-extra-parens': [
        'error',
        'all',
        {
          allowParensAfterCommentPattern: '@type'
        }
      ],
      '@stylistic/no-mixed-operators': 'off',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/object-property-newline': [
        'error',
        {
          allowAllPropertiesOnSameLine: true
        }
      ],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          asyncArrow: 'always',
          named: 'never'
        }
      ]
    }
  },
  // TypeScript plugin configuration.
  .../** @type {import('eslint').Linter.Config[]} */(
    ts.configs.strictTypeChecked.map(config => ({
      ...config,
      rules: {
        ...config.rules,
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-base-to-string': 'off',
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false
          }
        ],
        '@typescript-eslint/no-misused-spread': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            varsIgnorePattern: '^_$'
          }
        ]
      }
    }))
  ),
  // Unicorn plugin configuration.
  {
    ...unicorn.configs.all,
    rules: {
      ...unicorn.configs.all.rules,
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-empty-file': 'off',
      'unicorn/no-for-loop': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-query-selector': 'off',
      'unicorn/switch-case-braces': 'off'
    }
  },
  // General configuration.
  {
    ignores: ['_site/*', '**/sw.js']
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser
      },
      parserOptions: {
        project: ['./tsconfig.json']
      },
      sourceType: 'module'
    }
  }
);
/* eslint-enable @typescript-eslint/no-unsafe-argument */
