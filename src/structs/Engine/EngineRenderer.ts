import { Engine } from './Engine';
import { BaseRenderer } from '../Base/BaseRenderer';

export interface EngineRenderer extends BaseRenderer {
  init(engine: Engine): void;
}
