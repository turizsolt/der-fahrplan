import { testContainer } from "../../src/di/test.config";
import { TYPES } from "../../src/di/TYPES";
import { Store } from "../../src/structs/Interfaces/Store";
import * as fs from 'fs';
import * as path from 'path';
import { expect } from "chai";

const store = testContainer.get<() => Store>(TYPES.FactoryOfStore)();

describe('Visual test', () => {
    it('test01', () => {
        store.clear();
        const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'cases/test01.json'), 'utf8'));
        store.loadAll(json.data);
        const actionStore = store.getActionStore();
        actionStore.setActions(json.actions);
        const verdict = actionStore.runAll();
        expect(verdict).equals('succeded');
    });
});
