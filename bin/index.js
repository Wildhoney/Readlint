#!/usr/bin/env node

require('@babel/register');

const findUp = require('find-up');
const chalk = require('chalk');
const figlet = require('figlet');
const R = require('ramda');
const message = require('msg-generator');
const runTest = require('../src/index.js').default;

async function main() {
    const filename = await findUp('README.md');
    const report = await runTest(filename);
    const isValid = R.isEmpty(report);

    figlet('Lintme', { font: 'univers' }, (_, data) => {
        console.log(chalk.gray(data));

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
