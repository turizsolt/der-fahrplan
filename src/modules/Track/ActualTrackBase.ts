import { Platform } from '../../structs/Interfaces/Platform';
import { TrackEnd } from './TrackEnd';
import { TrackCurve } from './TrackCurve';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { TrackBase } from './TrackBase';
import { injectable } from 'inversify';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Wagon, NearestWagon } from '../../structs/Interfaces/Wagon';
import { WagonEnd } from '../../structs/Actuals/Wagon/WagonEnd';

@injectable()
export abstract class ActualTrackBase extends ActualBaseBrick
  implements TrackBase {
  protected A: TrackEnd;
  protected B: TrackEnd;
  protected I: Coordinate;
  protected curve: TrackCurve;
  protected checkedList: Wagon[] = [];
  protected _platformsBeside: Platform[] = [];
  protected removed: boolean = false;

  abstract getRenderer(): BaseRenderer;

  getPlatformsBeside() {
    return this._platformsBeside;
  }

  checkin(engine: Wagon) {
    this.checkedList.push(engine);
    this.update();
  }

  checkout(engine: Wagon) {
    this.checkedList = this.checkedList.filter(elem => elem !== engine);
    this.update();
  }

  isEmpty(): boolean {
    return this.checkedList.length === 0;
  }

  getCheckedList(): Wagon[] {
    return this.checkedList;
  }

  addPlatform(platform: Platform) {
    this._platformsBeside.push(platform);
  }

  getCurve(): TrackCurve {
    return this.curve;
  }

  getA(): TrackEnd {
    return this.A;
  }

  getB(): TrackEnd {
    return this.B;
  }

  getLength(): number {
    return this.getCurve().getLength();
  }

  remove(): boolean {
    if (this.isRemovable()) {
      this.removed = true;
      return true;
    }
    return false;
  }

  isRemovable(): boolean {
    return this.checkedList.length === 0;
  }

  isRemoved(): boolean {
    return this.removed;
  }

  update(): void {}

  getEnd(e: string): TrackEnd {
    if (e === 'A') return this.getA();
    if (e === 'B') return this.getB();
    return null;
  }

  // todo should be in separate static file
  getWagonClosest(
    from: number,
    to: number,
    excludeWagon: Wagon,
    ttl: number,
    initDist: number = 0
  ): NearestWagon {
    if (ttl === 0) return null;

    let sign = Math.sign(to - from); // 1 to B, -1 to A

    let ret: NearestWagon = {
      distance: Infinity,
      wagon: null,
      end: null
    };

    for (let wagon of this.checkedList) {
      if (wagon === excludeWagon) continue;

      ret = this.handleWagonEnd(ret, from, to, sign, wagon.getA());
      ret = this.handleWagonEnd(ret, from, to, sign, wagon.getB());
    }

    if (ret.distance === Infinity) {
      if (sign === 1) {
        const nextTrack = this.getB().getConnectedEndOf();
        if (!nextTrack) return null;
        const [newFrom, newTo] = this.getB().isSwitchingEnds()
          ? [0, 1]
          : [1, 0];
        return nextTrack.getWagonClosest(
          newFrom,
          newTo,
          excludeWagon,
          ttl - 1,
          initDist + Math.abs(to - from)
        );
      } else {
        const nextTrack = this.getA().getConnectedEndOf();
        if (!nextTrack) return null;
        const [newFrom, newTo] = this.getA().isSwitchingEnds()
          ? [1, 0]
          : [0, 1];
        return nextTrack.getWagonClosest(
          newFrom,
          newTo,
          excludeWagon,
          ttl - 1,
          initDist + Math.abs(from - to)
        );
      }
      return null;
    } else {
      ret.distance += initDist;
      return ret;
    }
  }

  private handleWagonEnd(
    ret: NearestWagon,
    from: number,
    to: number,
    sign: number,
    end: WagonEnd
  ) {
    const dist = end.positionOnTrack.getPercentage() - from;
    if (dist * sign < 0) {
      return ret;
    }
    if (Math.abs(dist) < ret.distance) {
      const ret2 = {
        distance: Math.abs(dist),
        wagon: end.getEndOf(),
        end: end
      };
      return ret2;
    } else {
      return ret;
    }
  }
}
