#!/usr/bin/env node

/*
* guru scripts
*/
'use strict';

const shell = require('shelljs');
const path = require('path');
const watch = require('watch');
const argv = require('minimist')(process.argv);
const chalk = require('chalk');

// tasks
const buildBabel = require('./modules/babel-build');
const copy = require('./modules/copy');
const clean = require('./modules/clean');
// const eslint = require('./modules/eslint');


const root = process.cwd() + '/';
const dist = path.join(root + 'dist');
const src = path.join(root + 'src');
const config = require(root + 'package');


const pipe = sequence => {
  return sequence.reduce((previous, current) => current(Object.assign(
    {}, 
    {
      root,
      dist,
      src,
      config
    }, 
    { initialValue: previous }
  )), null);
};


const run = () => pipe([
  clean,
  // eslint,
  copy,
  buildBabel
]);


if (argv.h || argv.help) {
  process.stdout.write('help');
  
} else {
  if (argv.s || argv.silent) {
    shell.config.silent = true;
  } else {
    shell.config.silent = false;
  }

  if (argv.w || argv.watch) {
    watch.watchTree(src, (f, curr, prev) => {
      const date = new Date();
      process.stdout.write(chalk.green(`Watching ${src}\n`));
      process.stdout.write(chalk.yellow(`${date}\n\n`));
      
      run();

      if (typeof f === 'object' && prev === null && curr === null) {
        // Finished walking the tree
      } else if (prev === null) {
        // f is a new file
      } else if (curr.nlink === 0) {
        // f was removed
      } else {
        // f was changed
      }
    });
  } else {
    run();
  }
}

shell.config.silent = false;

