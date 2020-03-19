import { Engine } from '../Interfaces/Engine';
import { BaseRenderer } from './BaseRenderer';

export interface EngineRenderer extends BaseRenderer {
  init(engine: Engine): void;
}
