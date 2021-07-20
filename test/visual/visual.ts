import { testContainer } from "../../src/di/test.config";
import { TYPES } from "../../src/di/TYPES";
import { Store } from "../../src/structs/Interfaces/Store";
import * as fs from 'fs';
import * as path from 'path';
import { expect } from "chai";

const store = testContainer.get<() => Store>(TYPES.FactoryOfStore)();

export function runVisualTest(testName: string): void {
    store.clear();
    const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, `cases/${testName}.json`), 'utf8'));
    store.loadAll(json.data);
    const actionStore = store.getCommandLog();
    actionStore.setActions(json.actions);
    const { result: verdict } = actionStore.runAll();
    expect(verdict).equals('succeded');
}
