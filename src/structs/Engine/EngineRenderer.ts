import { Engine } from './Engine';

export interface EngineRenderer {
  init(engine: Engine): void;
  update();
}
