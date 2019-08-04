module.exports = {
  globals: {
    graphql: true,
    __PATH_PREFIX__: true,
  },
  extends: [ 
  'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
  'react-app',
  'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
],
  plugins: ['@typescript-eslint', 'react', 'jsx-a11y', 'react-hooks'],
  parser: `@typescript-eslint/parser`,
  // plugins: ['@typescript-eslint/eslint-plugin', 'prettier', 'jsx-a11y', 'react-hooks'],
  rules: {
    ['prettier/prettier']: 'error',
    ['react-hooks/rules-of-hooks']: 'error',
    ['react-hooks/exhaustive-deps']: 'warn',
    "arrow-body-style": ["error", "as-needed"],
    "@typescript-eslint/explicit-function-return-type": 0,
    "typescript/no-unused-expression": false

  }
}