import { injectable } from 'inversify';
import { Wagon } from '../../Interfaces/Wagon';
import { Train } from '../../Scheduling/Train';
import { TYPES } from '../../../di/TYPES';
import { Store } from '../../Interfaces/Store';
import { Platform } from '../../Interfaces/Platform';
import { Trip } from '../../Scheduling/Trip';

@injectable()
export class WagonAnnouncement {
  protected trip: Trip;
  protected train: Train;

  constructor(private parent: Wagon, private store: Store) {
    this.train = this.store.create<Train>(TYPES.Train).init(this.parent);
  }

  assignTrip(trip: Trip): void {
    this.train.assignTrip(trip, [this.parent]);
  }

  cancelTrip(): void {
    this.train.assignTrip(null, [this.parent]);
  }

  setTrip(trip: Trip) {
    this.trip = trip;
  }

  getTrip(): Trip {
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
    const platformsInvolved: Platform[] = this.platformsBeside();
    platformsInvolved.map(p => this.stoppedAt(p));
  }

  platformsBeside(): Platform[] {
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
    return platformsInvolved;
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
          this.trip.getRoute()
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
