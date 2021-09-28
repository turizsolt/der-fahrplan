import { injectable } from 'inversify';
import { CapacityCapRenderer } from '../../src/structs/Renderers/CapacityCapRenderer';

@injectable()
export class WaitingHallDummyRenderer implements CapacityCapRenderer {
  setSelected(selected: boolean): void { }
  isSelected(): boolean {
    return null;
  }
  process(command: string): void { }
  init(_: any): void { }
  update(_: any): void { }
  remove(): void { }
}
