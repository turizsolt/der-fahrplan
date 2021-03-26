import { Store } from './Store';
import { Selectable } from './Selectable';

export interface BaseStorable extends Selectable {
  getId(): string;
  getType(): symbol;
  persist(): Object;
  persistDeep(): Object;
  persistShallow(): Object;
  load(obj: Object, store: Store): void;
  presetId(id: string): void;
  remove(): void;
}
