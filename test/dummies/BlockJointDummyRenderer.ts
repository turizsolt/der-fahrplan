import { injectable } from 'inversify';
import { BlockJointRenderer } from '../../src/structs/Renderers/BlockJointRenderer';

@injectable()
export class BlockJointDummyRenderer implements BlockJointRenderer {
  setSelected(selected: boolean): void {}
  isSelected(): boolean {
    return null;
  }
  process(command: string): void {}
  init(_: any): void {}
  update(_: any): void {}
  remove(): void {}
}
