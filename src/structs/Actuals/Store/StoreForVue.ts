import { productionContainer2d } from '../../../di/production.2d.config';
import { productionContainer3d } from '../../../di/production.3d.config';
import { TYPES } from '../../../di/TYPES';
import { BaseStorable } from '../../Interfaces/BaseStorable';
import { Store } from '../../Interfaces/Store';

const productionContainer =
  globalThis.startParam === '2d'
    ? productionContainer2d
    : productionContainer3d;

const store: Store = productionContainer.get<() => Store>(
  TYPES.FactoryOfStore
)();

export const getStorable = (id: string): BaseStorable => {
  return store.get(id);
};

export const getAllOfStorable = <T extends BaseStorable>(type: symbol): T[] => {
  return store.getAllOf(type);
};

export const createStorable = <T>(type: symbol): T => {
  return store.create(type);
};

export const getStore = (): Store => {
  return store;
};
