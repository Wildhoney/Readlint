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
import * as theme from './theme.js';

const pkg = JSON.parse(
    fs.readFileSync(path.resolve(`${__dirname}/../package.json`), 'utf8')
);

async function main() {
    const filename = await findUp('README.md');
    const report = await runTest(filename);
    const isValid = R.isEmpty(report);

    figlet(capitalise(pkg.name), { font: 'univers' }, (_, data) => {
        data && console.log(chalk.gray(data));
        console.log(
            chalk.gray('Version:'.padStart(data ? 70 : 0)),
            pkg.version,
            '\n\n'
        );

        report.forEach(({ type, line, column, message }) => {
            console.log(
                theme.status(theme.statusType.failure)(` ${type} `),
                theme.separator(':'),
                theme.label('Line'),
                theme.value(line),
                theme.separator('/'),
                theme.label('Column'),
                theme.value(column),
                theme.separator(':'),
                theme.message(message),
                '\n'
            );
        });

        isValid &&
            console.log(
                theme.status(theme.statusType.success)(` OK `),
                theme.separator(':'),
                theme.message(message('success')),
                '\n'
            );

        process.exitCode = isValid ? 0 : 1;
    });
}

main();
