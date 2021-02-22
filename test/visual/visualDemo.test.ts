import { runVisualTest } from "./visual";

describe('Visual test', () => {
    ['test01', 'test02'].map(test => {
        it(test, () => { runVisualTest(test); });
    });
});
