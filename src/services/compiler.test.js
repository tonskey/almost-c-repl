import fs from 'fs';
import { compile } from './almost-c-compiler';

const testFolder = 'src/tests/';

const compileWrapper = code => {
    try {
        return compile(code).result;
    } catch (e) {
        if (e.type === 'LOOP_ERROR') {
            return ['impossible'];
        }
        return e.message;
    }
};

const files = fs.readdirSync(testFolder);

const tests = files
    .filter(
        file =>
            file.includes('.in') && files.includes(file.split('.')[0] + '.out')
    )
    .map(file => {
        const name = file.split('.')[0];
        return {
            name,
            data: fs.readFileSync(testFolder + name + '.in', 'utf-8'),
            answer: fs.readFileSync(testFolder + name + '.out', 'utf-8')
        };
    });

describe('start testing compile module', () => {
    for (let testFile of tests) {
        test('test name:' + testFile.name, () => {
            expect(compileWrapper(testFile.data)).toEqual(
                testFile.answer.split('\n').filter(i => i)
            );
        });
    }
});
