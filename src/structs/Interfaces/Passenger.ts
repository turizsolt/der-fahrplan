import { Engine } from './Engine';
import { Platform } from './Platform';
import { BaseBrick } from './BaseBrick';
import { Coordinate } from '../Geometry/Coordinate';

export interface Passenger extends BaseBrick {
  init(to: Platform, from: Platform);
  updatePosition();
  checkTrain(engine: Engine);
  isArrivedAt(platform: Platform);
  checkShouldGetOffAt(platform: Platform);
  getOff();

  getPosition(): Coordinate;
  getTo(): Platform;
  isOnPlatformOrEngine(): boolean;
}
