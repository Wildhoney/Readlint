import fs from 'fs';
import marked from 'marked';
import findUp from 'find-up';
import * as u from './utils.js';

export const eslint = async ({ entry, startLine }) => {
    const parseErrors = report =>
        report.results[0].messages.map(({ message, line, column }) => ({
            type: 'eslint',
            message,
            line: startLine + line,
            column
        }));
    try {
        const { CLIEngine } = await import('eslint');
        const cli = new CLIEngine({
            envs: ['browser'],
            useEslintrc: true
        });
        const report = cli.executeOnText(entry.text);
        return report.errorCount > 0 ? parseErrors(report) : null;
    } catch (err) {
        return null;
    }
};

export const jshint = async ({ entry, startLine }) => {
    const parseErrors = report =>
        report.errors.map(({ reason, line, character }) => ({
            type: 'jshint',
            message: reason,
            line: startLine + line,
            column: character
        }));
    try {
        const config = JSON.parse(
            fs.readFileSync(await findUp('.jshintrc'), 'utf8')
        );
        const { JSHINT } = await import('jshint');
        await JSHINT.jshint(entry.text, config);
        const report = JSHINT.data();
        return report.errors ? parseErrors(report) : null;
    } catch (err) {
        return null;
    }
};

export const stylelint = async ({ entry, startLine }) => {
    const parseErrors = report =>
        report.results[0].warnings.map(({ text, line, column }) => ({
            type: 'stylelint',
            message: text,
            line: startLine + line,
            column
        }));
    try {
        const StyleLint = await import('stylelint');
        const report = await StyleLint.lint({
            code: entry.text,
            formatter: 'json'
        });
        return report.errored ? parseErrors(report) : null;
    } catch (err) {
        return null;
    }
};

export const jsonlint = async ({ entry, startLine }) => {
    const parseErrors = ({ error, line, character }) => [
        {
            type: 'jsonlint',
            message: error,
            line: startLine + line,
            column: character
        }
    ];
    try {
        const JSONLint = await import('json-lint');
        const report = JSONLint.default(entry.text);
        return report.error ? parseErrors(report) : null;
    } catch (err) {
        return null;
    }
};

export const htmllint = async ({ entry, startLine }) => {
    const parseErrors = errors =>
        errors.map(({ rule, line, column }) => ({
            type: 'htmllint',
            message: rule,
            line: startLine + line,
            column
        }));
    try {
        const HTMLLint = await import('htmllint');
        const config = JSON.parse(
            fs.readFileSync(await findUp('.htmllintrc'), 'utf8')
        );
        const report = await HTMLLint.default(entry.text, config);
        return report.length > 0 ? parseErrors(report) : null;
    } catch (err) {
        return null;
    }
};

export const yamllint = async ({ entry, startLine }) => {
    const parseErrors = ({ reason, mark: { line, position } }) => [
        {
            type: 'yamllint',
            message: reason,
            line: startLine + line,
            column: position
        }
    ];
    try {
        const YAMLLint = await import('yaml-lint');
        try {
            return await YAMLLint.lint(entry.text);
        } catch (err) {
            return parseErrors(err);
        }
    } catch (err) {
        return null;
    }
};

export const lint = async ({ entry, startLine }) => {
    switch (entry.lang) {
        case 'javascript':
            return []
                .concat(await eslint({ entry, startLine }))
                .concat(await jshint({ entry, startLine }));
        case 'css':
            return stylelint({ entry, startLine });
        case 'json':
            return jsonlint({ entry, startLine });
        case 'html':
            return htmllint({ entry, startLine });
        case 'yaml':
            return yamllint({ entry, startLine });
        default:
            return null;
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
