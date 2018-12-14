import path from 'path';
import test from 'ava';
import runTest from '../';

test('It should be able to parse JS examples with full URL imports;', async t => {
    const file = path.resolve('./src/__tests__/mocks/first.md');
    t.deepEqual(await runTest(file), []);
});

test('It should be able to parse JS examples with node style requires;', async t => {
    const file = path.resolve('./src/__tests__/mocks/second.md');
    t.deepEqual(await runTest(file), []);
});

test('It should be able to parse CSS examples;', async t => {
    const file = path.resolve('./src/__tests__/mocks/third.md');
    t.deepEqual(await runTest(file), []);
});
