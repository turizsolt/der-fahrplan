import { injectable } from 'inversify';
import { SignalRenderer } from '../../src/structs/Renderers/SignalRenderer';

@injectable()
export class SignalDummyRenderer implements SignalRenderer {
  setSelected(selected: boolean): void {}
  isSelected(): boolean {
    return null;
  }
  process(command: string): void {}
  init(_: any): void {}
  update(_: any): void {}
  remove(): void {}
}
