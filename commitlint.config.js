const Configuration = {
  /*
  * Resolve and load @commitlint/config-conventional from node_modules.
  * Referenced packages must be installed
  */
  extends: ['@commitlint/config-angular'],
  /*
  * Resolve and load @commitlint/format from node_modules.
  * Referenced package must be installed
  */
  formatter: '@commitlint/format',
  /*
  * Whether commitlint uses the default ignore rules.
  */
  defaultIgnores: true,
  /*
  * Custom URL to show upon failure
  */
  helpUrl:
    'https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines',
  rules: {
    'type-enum': [2, 'always', ['ci', 'docs', 'feat', 'fix', 'refactor', 'test', 'chore']],
  },
};

module.exports = Configuration;
