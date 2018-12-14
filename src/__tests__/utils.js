import fs from 'fs';
import path from 'path';
import test from 'ava';
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
    const content = {
        mixed: fs.readFileSync(
            path.resolve('./src/__tests__/mocks/mixed.md'),
            'utf8'
        ),
        syntaxError: fs.readFileSync(
            path.resolve('./src/__tests__/mocks/syntax-error.md'),
            'utf8'
        )
    };
    t.deepEqual(u.langLineNumbers(content.mixed), [1, 8]);
    t.deepEqual(u.langLineNumbers(content.syntaxError), [5]);
});
