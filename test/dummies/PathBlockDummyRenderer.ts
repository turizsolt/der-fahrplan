import { injectable } from 'inversify';
import { PathBlockRenderer } from '../../src/structs/Renderers/PathBlockRenderer';

@injectable()
export class PathBlockDummyRenderer implements PathBlockRenderer {
  setSelected(selected: boolean): void {}
  isSelected(): boolean {
    return null;
  }
  process(command: string): void {}
  init(_: any): void {}
  update(_: any): void {}
  remove(): void {}
}
