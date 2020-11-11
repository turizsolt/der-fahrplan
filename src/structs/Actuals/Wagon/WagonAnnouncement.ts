import { injectable } from 'inversify';
import { Wagon } from '../../Interfaces/Wagon';
import { Route } from '../../Scheduling/Route';
import { Train } from '../../Scheduling/Train';
import { TYPES } from '../../../di/TYPES';
import { Store } from '../../Interfaces/Store';
import { Platform } from '../../Interfaces/Platform';
import { Trip } from '../../Scheduling/Trip';

@injectable()
export class WagonAnnouncement {
  protected trip: Route;
  protected train: Train;

  constructor(private parent: Wagon, private store: Store) {
    this.train = this.store.create<Train>(TYPES.Train).init(this.parent);
  }

  assignTrip(trip: Trip): void {
    // const oldTrip = this.getTrip();
    // if (oldTrip) {
    //   for (let stop of oldTrip.getStops()) {
    //     stop.getStation().deannounce(oldTrip);
    //   }
    // }
    // this.trip = route;
    // if (route) {
    //   this.train.setSchedulingWagon(this.parent);
    // }
    // const newTrip = this.getTrip();
    // if (newTrip) {
    //   for (let stop of newTrip.getStops()) {
    //     stop.getStation().announce(newTrip);
    //   }
    // }
  }

  cancelTrip(): void {
    // this.train.cancelTrip();
  }

  getTrip(): Trip {
    // if (this.trip) return this.trip;
    // if (this.getTrain().getSchedulingWagon() !== this.parent)
    //   return this.getTrain().getTrip();
    // return null;
    const wagonWithTrip = this.train
      .getWagonsWithSides()
      .find(x => x.wagon === this.parent);
    return wagonWithTrip?.trip;
  }

  getTrain(): Train {
    return this.train;
  }

  setTrain(train: Train): void {
    if (train) {
      this.train = train;
    } else {
      this.train = this.store.create<Train>(TYPES.Train).init(this.parent);
    }
  }

  stop(): void {
    // todo use the worm
    const platformsInvolved: Platform[] = [];
    const trackA = this.parent.getA().positionOnTrack.getTrack();
    platformsInvolved.push(
      ...trackA
        .getPlatformsBeside()
        .filter(p => this.parent.getA().positionOnTrack.isBeside(p))
    );
    const trackB = this.parent.getB().positionOnTrack.getTrack();
    trackB
      .getPlatformsBeside()
      .filter(p => this.parent.getB().positionOnTrack.isBeside(p))
      .map((p: Platform) => {
        if (!platformsInvolved.find(x => x === p)) {
          platformsInvolved.push(p);
        }
      });

    platformsInvolved.map(p => this.stoppedAt(p));
  }

  stoppedAt(platform: Platform): void {
    this.train.stoppedAt(platform.getStation(), platform);
  }

  announceStoppedAt(platform: Platform): void {
    const station = platform.getStation();
    this.parent.getBoardedPassengers().map(p => {
      if (p) {
        p.listenWagonStoppedAtAnnouncement(
          station,
          platform,
          this.train,
          this.trip
        );
      }
    });
  }

  persist(): any {
    return {
      trip: this.trip && this.trip.getId(),
      train: this.train.getId()
    };
  }
}
