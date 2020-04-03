import { Store } from './Store';

export interface BaseStorable {
  getId(): string;
  getType(): symbol;
  persist(): Object;
  persistDeep(): Object;
  load(obj: Object, store: Store): void;
  presetId(id: string): void;
}
