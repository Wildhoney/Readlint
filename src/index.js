import fs from 'fs';
import marked from 'marked';
import * as R from 'ramda';
import { CLIEngine } from 'eslint';
import StyleLint from 'stylelint';
import Prettier from 'prettier';

const cli = new CLIEngine({
    envs: ['browser'],
    useEslintrc: true
});

export const isValidRule = R.complement(R.isNil);

export const eslint = ({ entry }) => {
    const report = cli.executeOnText(entry.text);
    return report.errorCount > 0 ? report.results : null;
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

export const lint = ({ entry, filename }) => {
    switch (entry.lang) {
        case 'javascript':
            return [].concat(eslint({ entry }), prettier({ entry, filename }));
        case 'css':
            return stylelint({ entry });
    }
};

export default async filename => {
    const content = fs.readFileSync(filename, 'utf8');
    const ast = marked.lexer(content);
    const reports = await Promise.all(
        ast.flatMap(entry => lint({ entry, filename }))
    );
    return reports.filter(isValidRule);
};
