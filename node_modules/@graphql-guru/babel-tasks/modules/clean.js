'use strict';

const shell = require('shelljs');
const chalk = require('chalk');

module.exports = function clean ({ dist }) {
  process.stdout.write(chalk.yellow('Starting Clean.\n'));
  shell.rm('-r', dist);
  process.stdout.write(chalk.yellow('Clean completed.\n\n'));
};
