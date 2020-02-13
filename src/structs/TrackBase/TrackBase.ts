import { Engine } from '../Engine/Engine';
import { Platform } from '../Platform';

export interface TrackBase {
  checkin(engine: Engine);
  checkout(engine: Engine);
  addPlatform(platform: Platform);
}
