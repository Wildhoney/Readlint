#!/usr/bin/env node

require('@babel/register');

const fs = require('fs');
const path = require('path');
const findUp = require('find-up');
const chalk = require('chalk');
const figlet = require('figlet');
const R = require('ramda');
const message = require('msg-generator');
const capitalise = require('capitalize');
const runTest = require('../src/index.js').default;

const pkg = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf8'));

async function main() {
    const filename = await findUp('README.md');
    const report = await runTest(filename);
    const isValid = R.isEmpty(report);

    figlet(capitalise(pkg.name), { font: 'univers' }, (_, data) => {
        console.log(chalk.gray(data));
        console.log(chalk.gray('Version:'.padStart(70)), pkg.version, '\n\n');

        report.forEach(({ type, line, column, message }) => {
            console.log(
                chalk.bgRedBright(` ${type} `),
                chalk.gray(':'),
                chalk.underline.white('Line'),
                chalk.underline.redBright(line),
                chalk.gray('/'),
                chalk.underline.white('Column'),
                chalk.redBright(column),
                chalk.gray(':'),
                message,
                '\n'
            );
        });

        isValid &&
            console.log(
                chalk.bgGreen(` OK `),
                chalk.gray(':'),
                message('success'),
                '\n'
            );

        process.exitCode = isValid ? 0 : 1;
    });
}

main();
