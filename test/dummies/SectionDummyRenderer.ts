import { injectable } from 'inversify';
import { SectionRenderer } from '../../src/structs/Renderers/SectionRenderer';

@injectable()
export class SectionDummyRenderer implements SectionRenderer {
  setSelected(selected: boolean): void {}
  isSelected(): boolean {
    return null;
  }
  process(command: string): void {}
  init(_: any): void {}
  update(_: any): void {}
  remove(): void {}
}
