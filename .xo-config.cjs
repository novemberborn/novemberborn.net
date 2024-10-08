module.exports = {
  prettier: true,
  space: true,
  semicolon: false,
  overrides: [
    {
      files: 'public/assets/**/*.js',
      env: 'browser',
      rules: {
        'no-bitwise': 'off',
      },
    },
  ],
}
