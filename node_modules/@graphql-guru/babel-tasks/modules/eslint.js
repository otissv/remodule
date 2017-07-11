'use strict';

const shell = require('shelljs');
const chalk = require('chalk');

module.exports = function eslint ({ root }) {
  process.stdout.write(chalk.yellow('Starting ESLint.\n'));
  shell.exec(`eslint --quiet ${root} && echo 'Completed:' && date || true`);
  process.stdout.write(chalk.yellow('ESLint completed.\n\n'));
};
