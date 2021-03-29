import { Store } from './Store';
import { Selectable } from './Selectable';

export interface BaseStorable extends Selectable {
  presetId(id: string): void;
  getId(): string;
  getType(): symbol;

  persist(): Object;
  persistDeep(): Object;
  persistShallow(): Object;
  load(obj: Object, store: Store): void;

  remove(): void;
  isRemovable(): boolean;
}
