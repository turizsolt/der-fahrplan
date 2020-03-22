import { Store } from '../Actuals/Store/Store';

export interface BaseStorable {
  getId(): string;
  persist(): Object;
  load(obj: Object, store: Store): void;
  presetId(id: string): void;
}
