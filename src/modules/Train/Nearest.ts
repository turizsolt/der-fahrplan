import { NearestWagon, Wagon } from '../../structs/Interfaces/Wagon';
import { WagonEnd } from '../../structs/Actuals/Wagon/WagonEnd';
import { TrackBase } from '../Track/TrackBase';

export class Nearest {
  static getWagonClosest(
    track: TrackBase,
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

    for (let wagon of track.getCheckedList()) {
      if (wagon === excludeWagon) continue;

      ret = this.handleWagonEnd(ret, from, to, sign, wagon.getA());
      ret = this.handleWagonEnd(ret, from, to, sign, wagon.getB());
    }

    if (ret.distance === Infinity) {
      if (sign === 1) {
        const nextTrack = track.getB().getConnectedEndOf();
        if (!nextTrack) return null;
        const [newFrom, newTo] = track.getB().isSwitchingEnds()
          ? [0, 1]
          : [1, 0];
        return Nearest.getWagonClosest(
          nextTrack,
          newFrom,
          newTo,
          excludeWagon,
          ttl - 1,
          initDist + Math.abs(to - from)
        );
      } else {
        const nextTrack = track.getA().getConnectedEndOf();
        if (!nextTrack) return null;
        const [newFrom, newTo] = track.getA().isSwitchingEnds()
          ? [1, 0]
          : [0, 1];
        return Nearest.getWagonClosest(
          nextTrack,
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

  static handleWagonEnd(
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
