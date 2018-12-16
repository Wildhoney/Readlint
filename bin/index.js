#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import findUp from 'find-up';
import chalk from 'chalk';
import figlet from 'figlet';
import R from 'ramda';
import message from 'msg-generator';
import capitalise from 'capitalize';
import runTest from '../src/index.js';

const pkg = JSON.parse(fs.readFileSync(path.resolve(`${__dirname}/../package.json`), 'utf8'));

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
