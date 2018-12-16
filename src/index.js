import fs from 'fs';
import marked from 'marked';
import { CLIEngine } from 'eslint';
import StyleLint from 'stylelint';
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

export const stylelint = async ({ entry, startLine }) => {
    const parseErrors = report =>
        report.results[0].warnings.map(({ text, line, column }) => ({
            type: 'stylelint',
            message: text,
            line: startLine + line,
            column
        }));
    const report = await StyleLint.lint({
        code: entry.text,
        formatter: 'json'
    });
    return report.errored ? parseErrors(report) : null;
};

export const lint = async ({ entry, startLine }) => {
    switch (entry.lang) {
        case 'javascript':
            return eslint({ entry, startLine });
        case 'css':
            return stylelint({ entry, startLine });
    }
};

export default async filename => {
    const content = fs.readFileSync(filename, 'utf8');
    const ast = marked.lexer(content);
    const lines = u.langLineNumbers(content);
    const reports = await Promise.all(
        ast.filter(u.isCodeBlock).map((entry, index) => {
            const startLine = lines[index];
            return lint({ entry, startLine });
        })
    );
    return reports.flat().filter(u.isValid);
};
