module.exports = {
  "env": {
      "es2021": true,
      "node": true
  },
  "extends": [
      "google"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
  },
  "plugins": [
      "@typescript-eslint"
  ],
  "rules": {
      "object-curly-spacing": "off",
      "max-len":"off"
  },
  "ignorePatterns": [
      "**/node_modules/**",
      "**/dist/**"
  ]

}