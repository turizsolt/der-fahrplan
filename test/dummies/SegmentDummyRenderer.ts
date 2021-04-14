import { injectable } from 'inversify';
import { SegmentRenderer } from '../../src/structs/Renderers/SegmentRenderer';

@injectable()
export class SegmentDummyRenderer implements SegmentRenderer {
  setSelected(selected: boolean): void {}
  isSelected(): boolean {
    return null;
  }
  process(command: string): void {}
  init(_: any): void {}
  update(_: any): void {}
  remove(): void {}
}
