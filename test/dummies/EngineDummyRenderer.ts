import { EngineRenderer } from '../../src/structs/Renderers/EngineRenderer';
import { Engine } from '../../src/structs/Interfaces/Engine';
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
  remove(): void {}
}
