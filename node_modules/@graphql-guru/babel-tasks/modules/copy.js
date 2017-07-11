'use strict';

const shell = require('shelljs');
const glob = require('glob-promise');
const Promise = require('bluebird');
const chalk = require('chalk');

module.exports = function copy ({ config, dist, src }) {
  process.stdout.write(chalk.yellow('Starting Copy.\n'));

  const customFile = config.tasks && config.tasks.move
    ? `${src}/**/$}config.tasks.move`
    : null;

  const move = [].concat(`${src}/**/*.gql`, `${src}/**/*.json`, customFile);

  move.forEach(pattern => {
    if (typeof pattern !== 'string') return;

    glob(pattern)
      .then(paths =>
        paths.map(p => {
          const pathSlit = p.split('src')[1];
          const fileName = p.substr(p.lastIndexOf('/') + 1);
          const dest = pathSlit.split(fileName)[0];

          return {
            path: p,
            dest: dest,
            fileName: fileName
          };
        })
      )
      .then(pathsObj => {
        pathsObj.forEach(obj => {
          const dest = `${dist}${obj.dest}`;
          shell.ls(dest);

          if (shell.error()) {
            Promise.resolve(shell.mkdir('-p', dest));
            process.stdout.write(`Creating ${dest}\n\n`);
          }

          shell.cp('-R', obj.path, dest + obj.fileName);
        });
      })
      .catch(error => process.stdout.write('copy: ', error));
  });

  process.stdout.write(chalk.yellow('Copying files completed.\n\n'));
};
