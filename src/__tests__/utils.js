import fs from 'fs';
import test from 'ava';
import glob from 'glob';
import * as u from '../utils.js';

test('It should be able to determine when something is valid;', t => {
    t.true(u.isValid({}));
    t.false(u.isValid(null));
});

test('It should be able to tell whether an entry is a valid code block;', t => {
    t.true(u.isCodeBlock({ lang: 'javascript' }));
    t.true(u.isCodeBlock({ lang: 'css' }));
    t.false(u.isCodeBlock({}));
});

test('It should be able to parse the line numbers of the code blocks;', t => {
    const filenames = glob.sync('./src/__tests__/mocks/*.md');
    const content = filenames
        .map(filename => fs.readFileSync(filename, 'utf8'))
        .join('\n');
    t.deepEqual(u.langLineNumbers(content), [
        7,
        17,
        39,
        47,
        61,
        70,
        84,
        108,
        120,
        136,
        144,
        163,
        174
    ]);
});
