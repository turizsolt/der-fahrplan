import { EngineRenderer } from './EngineRenderer';
import { Engine } from './Engine';
import { injectable } from 'inversify';

@injectable()
export class EngineDummyRenderer implements EngineRenderer {
  init(_: Engine) {}
  update() {}
}
