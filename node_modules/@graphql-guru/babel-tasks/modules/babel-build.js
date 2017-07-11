'use strict';

const shell = require('shelljs');
const chalk = require('chalk');

module.exports = function buildBabel ({ dist, src }) {
  process.stdout.write(chalk.yellow('Starting Babel build.\n'));
  shell.exec(`babel -d ${dist} ${src} -s --ignore node_modules,public`);
  process.stdout.write(chalk.yellow('Babel build completed.\n\n'));
};
