import { BaseRenderer } from '../Renderers/BaseRenderer';
import { Store } from '../Actuals/Store/Store';

export interface BaseBrick {
  getId(): string;
  getRenderer(): BaseRenderer;
  persist(): Object;
  load(obj: Object, store: Store): void;
  presetId(id: string): void;
}
