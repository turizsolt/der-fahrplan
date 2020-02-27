import { Platform } from './Platform';
import { PlatformRenderer } from './PlatformRenderer';
import { injectable } from 'inversify';

@injectable()
export class PlatformDummyRenderer implements PlatformRenderer {
  init(_: Platform) {}
}
