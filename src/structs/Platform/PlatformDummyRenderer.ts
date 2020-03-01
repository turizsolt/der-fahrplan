import { Platform } from './Platform';
import { PlatformRenderer } from './PlatformRenderer';
import { injectable } from 'inversify';

@injectable()
export class PlatformDummyRenderer implements PlatformRenderer {
  setSelected(selected: boolean): void {}
  isSelected(): boolean {
    return null;
  }
  process(command: string): void {}
  update() {}
  init(_: Platform) {}
}
