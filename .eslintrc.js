module.exports = {
    root: true,
    env: {
        es2021: true,
        node: true,
    },
    extends: [ 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier' ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [ '@typescript-eslint', 'unused-imports', 'import' ],
    rules: {
        'import/order': [
            'error',
            {
                'groups': [ 'builtin', 'external', 'internal', [ 'parent', 'sibling', 'index' ] ],
                'newlines-between': 'always',
                'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
            }
        ],
        'unused-imports/no-unused-imports': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        quotes: [ 'error', 'single' ],
        'block-spacing': [ 'error', 'always' ],
        'array-bracket-spacing': [ 'error', 'always' ],
        'object-curly-spacing': [ 'error', 'always' ],
        'semi': [ 2, 'always' ],
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'none',
                    requireLast: true,
                },
            },
        ],
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'keyword-spacing': [ 'error', { before: true, after: true } ],
        'max-len': [ 'error', { code: 140, ignoreComments: true } ],
        'spaced-comment': [ 'error', 'always' ],
        'no-empty': [ 'error', { allowEmptyCatch: true } ],
        '@typescript-eslint/no-empty-function': 'off',
        indent: [ 'error', 4, { ignoredNodes: [ 'PropertyDefinition' ] } ],
        '@typescript-eslint/no-unused-vars': 'off',
    },
    ignorePatterns: [ '@declarations/**/*.ts' ]
};
