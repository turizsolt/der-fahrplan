import { productionContainer } from "../../../di/production.config";
import { TYPES } from "../../../di/TYPES";
import { BaseStorable } from "../../Interfaces/BaseStorable";
import { Store } from "../../Interfaces/Store";

const store: Store = productionContainer.get<() => Store>(TYPES.FactoryOfStore)();

export const getStorable = (id: string): BaseStorable => {
    return store.get(id);
};

export const getAllOfStorable = <T extends BaseStorable>(type: symbol): T[] => {
    return store.getAllOf(type);
};

export const createStorable = <T>(type: symbol): T => {
    return store.create(type);
}
