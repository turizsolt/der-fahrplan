import { injectable } from 'inversify';
import { Wagon } from '../../Interfaces/Wagon';
import { Store } from '../../Interfaces/Store';
import { Platform } from '../../Interfaces/Platform';
import { Trip } from '../../Scheduling/Trip';
import { Train } from '../../../modules/Train/Train';
import { WhichEnd } from '../../Interfaces/WhichEnd';

// todo redo everything

@injectable()
export class WagonAnnouncement {
  protected trip: Trip;

  constructor(
    private parent: Wagon,
    private store: Store,
    private train: Train
  ) {}

  assignTrip(trip: Trip): void {
    // this.train.assignTrip(trip, [this.parent]);
  }

  cancelTrip(): void {
    // this.train.assignTrip(null, [this.parent]);
  }

  setTrip(trip: Trip) {
    this.trip = trip;
  }

  getTrip(): Trip {
    return this.trip;
  }

  getTrain(): Train {
    return this.train;
  }

  setTrain(train: Train): void {
    this.train = train;
  }

  stop(): void {
    // todo use the worm
    // todo worm is obsolete now, use the markers
    const platformsInvolved: Platform[] = this.platformsBeside();
    platformsInvolved.map(p => this.stoppedAt(p));
  }

  platformsBeside(): Platform[] {
    const platformsInvolved: Platform[] = [];
    const trackA = this.parent.getAxlePosition(WhichEnd.A).getTrack();
    platformsInvolved.push(
      ...trackA
        .getPlatformsBeside()
        .filter(p => p.isBesidePoT(this.parent.getAxlePosition(WhichEnd.A)))
    );
    const trackB = this.parent.getAxlePosition(WhichEnd.B).getTrack();
    trackB
      .getPlatformsBeside()
      .filter(p => p.isBesidePoT(this.parent.getAxlePosition(WhichEnd.B)))
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
}
