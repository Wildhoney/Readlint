import fs from 'fs';
import marked from 'marked';
import { CLIEngine } from 'eslint';
import StyleLint from 'stylelint';
import Prettier from 'prettier';
import * as u from './utils.js';

const cli = new CLIEngine({
    envs: ['browser'],
    useEslintrc: true
});

export const eslint = ({ entry, startLine }) => {
    const parseErrors = report =>
        report.results[0].messages.map(({ message, line, column }) => ({
            type: 'eslint',
            message,
            line: startLine + line,
            column
        }));
    const report = cli.executeOnText(entry.text);
    return report.errorCount > 0 ? parseErrors(report) : null;
};

export const stylelint = async ({ entry }) => {
    const report = await StyleLint.lint({
        code: entry.text,
        formatter: 'json'
    });
    return report.errored ? report : null;
};

export const prettier = async ({ entry, filename }) => {
    const config = await Prettier.resolveConfig(filename);
    const report = Prettier.check(entry.text, config);
    return report || null;
};

export const lint = ({ entry, filename, startLine }) => {
    switch (entry.lang) {
        case 'javascript':
            return [].concat(
                eslint({ entry, startLine }),
                prettier({ entry, filename, startLine })
            );
        case 'css':
            return stylelint({ entry, startLine });
    }
};

export default async filename => {
    const content = fs.readFileSync(filename, 'utf8');
    const ast = marked.lexer(content);
    const lines = u.langLineNumbers(content);
    const reports = await Promise.all(
        ast.filter(u.isCodeBlock).flatMap((entry, index) => {
            const startLine = lines[index];
            return lint({ entry, startLine, filename });
        })
    );
    return reports.filter(u.isValid);
};
