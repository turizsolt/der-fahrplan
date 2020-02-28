import { EngineRenderer } from './EngineRenderer';
import { Engine } from './Engine';
import { injectable } from 'inversify';

@injectable()
export class EngineDummyRenderer implements EngineRenderer {
  setSelected(selected: boolean): void {}
  isSelected(): boolean {
    return null;
  }
  process(command: string): void {}
  init(_: Engine) {}
  update() {}
}
