import { Store } from './Store';

export interface BaseStorable {
  getId(): string;
  persist(): Object;
  load(obj: Object, store: Store): void;
  presetId(id: string): void;
}
