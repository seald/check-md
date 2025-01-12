#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const { Command } = require('commander');
const { checkAndThrow, presetConfig } = require('./');
const packInfo = require('./package.json');
const program = new Command()
  .version(packInfo.version, '-v, --version')
  .usage('[options]')
  .option('-f, --fix', 'Check and try to fix')
  .option('-c, --cwd [path]', 'Working directory of check-md, default to process.cwd()')
  .option('-r, --root [path]', `Checking url root, default to ${presetConfig.default.root.join(',')}`)
  .option('-p, --preset [name]', `Preset config(eg ${Object.keys(presetConfig).join(', ')})`)
  .option('-P, --pattern [pattern]', `Glob patterns, default to ${presetConfig.default.pattern}`)
  .option('-i, --ignore [pattern]', `Ignore patterns, will merge to pattern, default to ${presetConfig.default.ignore.join(',')}`)
  .option('-a, --aliases [aliases]', 'Path aliases in the form \'alias1=./actual/path/,alias2=./other/path/\'')
  .option('--ignore-footnotes', `Ignore footnotes, default to ${presetConfig.default.ignoreFootnotes}`)
  .option('--unique-slug-start-index [number]', `Index to start with when making duplicate slugs unique, default to ${presetConfig.default.uniqueSlugStartIndex}`)
  .option('--exit-level [level]', `Process exit level, default to ${presetConfig.default.exitLevel}, other choice is warn and none, it will not exit if setting to none`)
  .option('--default-index [index]', `Default index in directory, default to ${presetConfig.default.defaultIndex.join(',')}`);

program.parse(process.argv);

const options = {
  fix: !!program.fix,
  cwd: program.cwd,
  root: program.root ? program.root.split(',') : undefined,
  preset: program.preset,
  exitLevel: program.exitLevel,
  pattern: program.pattern ? program.pattern.split(',') : undefined,
  ignore: program.ignore ? program.ignore.split(',') : undefined,
  aliases: program.aliases ? program.aliases.split(',') : undefined,
  ignoreFootnotes: program.ignoreFootnotes,
  uniqueSlugStartIndex: program.uniqueSlugStartIndex,
  defaultIndex: program.defaultIndex ? program.defaultIndex.split(',') : undefined,
};

Object.keys(options).forEach(k => {
  if (options[k] === undefined) delete options[k];
});

const packageInfoPath = path.resolve(process.cwd(), 'package.json');
const packageInfo = fs.existsSync(packageInfoPath) ? JSON.parse(fs.readFileSync(packageInfoPath, { encoding: 'utf-8' })) : {};
if (packageInfo['check-md']) {
  // read from package.json
  Object.assign(options, packageInfo['check-md']);
}

checkAndThrow(options);
