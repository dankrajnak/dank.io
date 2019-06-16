module.exports = {
  globals: {
    graphql: true,
    __PATH_PREFIX__: true,
  },
  extends: [`prettier`,`react-app`],
  plugins: ['prettier', 'jsx-a11y', 'react-hooks'],
  rules: {
    ['prettier/prettier']: 'error',
    ['react-hooks/rules-of-hooks']: 'error',
    ['react-hooks/exhaustive-deps']: 'warn',
    "arrow-body-style": ["error", "as-needed"]

  }
}