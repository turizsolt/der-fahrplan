import { injectable } from 'inversify';
import { BlockRenderer } from '../../src/structs/Renderers/BlockRenderer';

@injectable()
export class BlockDummyRenderer implements BlockRenderer {
  setSelected(selected: boolean): void {}
  isSelected(): boolean {
    return null;
  }
  process(command: string): void {}
  init(_: any): void {}
  update(_: any): void {}
  remove(): void {}
}
