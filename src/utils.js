import * as R from 'ramda';
import normalise from 'normalize-newline';

export const isValid = R.complement(R.isNil);

export const isCodeBlock = entry => Boolean(entry.lang);

export const langLineNumbers = content => {
    const lines = normalise(content).split('\n');
    return lines
        .map((line, lineNumber) => {
            const isCodeBlock = line.match(/^```\w+/);
            return isCodeBlock ? lineNumber + 1 : null;
        })
        .filter(isValid);
};
