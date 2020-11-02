import { BaseStorable } from './BaseStorable';

export interface Store {
  init();
  clear();
  register(object: BaseStorable, presetId?: string): string;
  unregister(object: BaseStorable): void;
  get(id: string): BaseStorable;
  getAll(): Record<string, BaseStorable>;
  getAllOf<T extends BaseStorable>(type: symbol): T[];
  getFiltered(filter: (b: BaseStorable) => boolean): BaseStorable[];
  persistAll(): Object;
  loadAll(arr: any[]);
  create<T>(type: symbol): T;

  setSelected(selected: BaseStorable): void;
  getSelected(): BaseStorable;
  clearSelected(): void;
}
