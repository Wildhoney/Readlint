import path from 'path';
import test from 'ava';
import runTest from '../';

test('It should be able to parse JavaScript snippets;', async t => {
    const file = path.resolve('./src/__tests__/mocks/javascript.md');
    t.deepEqual(await runTest(file), [
        {
            type: 'eslint',
            line: 8,
            column: 1,
            message: "'consta' is not defined."
        },
        {
            type: 'eslint',
            line: 9,
            column: 1,
            message: "'constb' is not defined."
        },
        {
            type: 'eslint',
            line: 11,
            column: 13,
            message: "'a' is not defined."
        },
        {
            type: 'eslint',
            line: 11,
            column: 17,
            message: "'b' is not defined."
        }
    ]);
});

test('It should be able to parse CSS snippets;', async t => {
    const file = path.resolve('./src/__tests__/mocks/css.md');
    t.deepEqual(await runTest(file), [
        {
            type: 'stylelint',
            line: 10,
            column: 1,
            message: 'Unexpected } (CssSyntaxError)'
        }
    ]);
});

test('It should be able to parse JSON snippets;', async t => {
    const file = path.resolve('./src/__tests__/mocks/json.md');
    t.deepEqual(await runTest(file), [
        {
            type: 'jsonlint',
            line: 24,
            column: 9,
            message:
                "Unknown Character 'e', expecting a string for key statement."
        }
    ]);
});
