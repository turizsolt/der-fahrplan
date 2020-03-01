import { BaseRenderer } from './BaseRenderer';
import { Store } from '../Store/Store';

export interface BaseBrick {
  getId(): string;
  getRenderer(): BaseRenderer;
  persist(): Object;
  load(obj: Object, store: Store): void;
  presetId(id: string): void;
}
