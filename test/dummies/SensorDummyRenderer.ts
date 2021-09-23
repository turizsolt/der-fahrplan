import { injectable } from 'inversify';
import { SensorRenderer } from '../../src/structs/Renderers/SensorRenderer';

@injectable()
export class SensorDummyRenderer implements SensorRenderer {
  setSelected(selected: boolean): void {}
  isSelected(): boolean {
    return null;
  }
  process(command: string): void {}
  init(_: any): void {}
  update(_: any): void {}
  remove(): void {}
}
