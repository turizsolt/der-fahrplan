import { TYPES } from "../src/di/TYPES";
import { Store } from "../src/structs/Interfaces/Store";
import { testContainer } from '../src/di/test.config';

const store = testContainer
    .get<() => Store>(TYPES.FactoryOfStore)()
    .init();

export function getTestStore(): Store {
    return store;
}