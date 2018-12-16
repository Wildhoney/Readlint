import path from 'path';
import test from 'ava';
import runTest from '../';

test('It should be able to parse JS with full URL imports;', async t => {
    const file = path.resolve('./src/__tests__/mocks/url-import.md');
    t.deepEqual(await runTest(file), []);
});

// test('It should be able to parse JS with node style requires;', async t => {
//     const file = path.resolve('./src/__tests__/mocks/require.md');
//     t.deepEqual(await runTest(file), []);
// });

// test('It should be able to parse CSS styles;', async t => {
//     const file = path.resolve('./src/__tests__/mocks/styles.md');
//     t.deepEqual(await runTest(file), []);
// });

// test('It should be able to parse mixed JS/CSS;', async t => {
//     const file = path.resolve('./src/__tests__/mocks/mixed.md');
//     t.deepEqual(await runTest(file), []);
// });

// test('It should be able to detect JS syntax errors;', async t => {
//     const file = path.resolve('./src/__tests__/mocks/js-error.md');
//     t.deepEqual(await runTest(file), [
//         {
//             type: 'eslint',
//             line: 6,
//             column: 1,
//             message: "'consta' is not defined."
//         },
//         {
//             type: 'eslint',
//             line: 7,
//             column: 1,
//             message: "'constb' is not defined."
//         },
//         {
//             type: 'eslint',
//             line: 9,
//             column: 13,
//             message: "'a' is not defined."
//         },
//         {
//             type: 'eslint',
//             line: 9,
//             column: 17,
//             message: "'b' is not defined."
//         }
//     ]);
// });

// test('It should be able to detect CSS syntax errors;', async t => {
//     const file = path.resolve('./src/__tests__/mocks/css-error.md');
//     t.deepEqual(await runTest(file), [
//         {
//             type: 'stylelint',
//             line: 8,
//             column: 1,
//             message: 'Unexpected } (CssSyntaxError)'
//         }
//     ]);
// });
