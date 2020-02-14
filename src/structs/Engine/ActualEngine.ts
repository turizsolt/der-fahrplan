import { Passenger } from '../Passenger/Passenger';
import { Track } from '../Track/Track';
import { TrackBase } from '../TrackBase/TrackBase';
import { Coordinate } from '../Geometry/Coordinate';
import { EngineRenderer } from './EngineRenderer';
import { TYPES } from '../TYPES';
import { inject, injectable } from 'inversify';
import { Engine } from './Engine';
import { Platform } from '../Platform';

@injectable()
export class ActualEngine implements Engine {
  private track: TrackBase;
  private trackDirection: number = 1;
  private position: Coordinate;
  private rotation: number;
  private positionOnTrack: number;
  private movable: boolean = true;
  private carriedPassengers: Passenger[] = [];
  @inject(TYPES.EngineRenderer) private renderer: EngineRenderer;

  putOnTrack(track: Track) {
    this.track = track;
    this.position = track.getSegment().getFirstPoint();
    this.positionOnTrack = 0;
    track.checkin(this);

    this.renderer.init(this);
    this.update();
  }

  getTrackOn(): TrackBase {
    return this.track;
  }

  getPosition(): Coordinate {
    return this.position;
  }

  getRotation(): number {
    return this.rotation;
  }

  forward() {
    if (!this.movable) return;
    if (this.trackDirection === 1) {
      this.moveTowardsB();
    } else {
      this.moveTowardsA();
    }
  }

  backward() {
    if (!this.movable) return;

    if (this.trackDirection === 1) {
      this.moveTowardsA();
    } else {
      this.moveTowardsB();
    }
  }

  private moveTowardsA() {
    // megy elore
    this.positionOnTrack -= 1;

    const trackLength = this.track.getSegment().getLength();
    if (this.positionOnTrack < 0) {
      // ha tulment

      const nextTrackEnd = this.track.getA().connectedToEnd;
      if (nextTrackEnd) {
        // van tovabb
        if (nextTrackEnd.getWhichEnd() === 'B') {
          this.track.checkout(this);
          this.track = this.track.getA().connectedTo;
          this.track.checkin(this);
          const prevTrackLength = this.track.getSegment().getLength();
          this.positionOnTrack += prevTrackLength;
        } else {
          // 'B'
          this.track.checkout(this);
          this.track = this.track.getA().connectedTo;
          this.track.checkin(this);
          const overRun = -this.positionOnTrack;
          this.positionOnTrack = overRun;
          this.trackDirection = -this.trackDirection;
        }
      } else {
        // nincs tovabb, megall
        this.positionOnTrack = 0;
      }
    } else {
      // ha nem ment tul - skip
    }
    this.update();
  }

  private moveTowardsB() {
    // megy elore
    this.positionOnTrack += 1;

    const trackLength = this.track.getSegment().getLength();
    if (this.positionOnTrack > trackLength) {
      // ha tulment

      const nextTrackEnd = this.track.getB().connectedToEnd;
      if (nextTrackEnd) {
        // van tovabb
        if (nextTrackEnd.getWhichEnd() === 'A') {
          this.track.checkout(this);
          this.track = this.track.getB().connectedTo;
          this.track.checkin(this);
          this.positionOnTrack -= trackLength;
        } else {
          // 'B'
          this.track.checkout(this);
          this.track = this.track.getB().connectedTo;
          this.track.checkin(this);
          const overRun = this.positionOnTrack - trackLength;
          this.positionOnTrack = this.track.getSegment().getLength() - overRun;
          this.trackDirection = -this.trackDirection;
        }
      } else {
        // nincs tovabb, megall
        this.positionOnTrack = trackLength;
      }
    } else {
      // ha nem ment tul - skip
    }
    this.update();
  }

  stop() {
    this.movable = false;

    this.track.getPlatformsBeside().map(platform => {
      if (this.isBeside(platform)) {
        this.callForArrivedPassengersAt(platform);
        platform.callForDepartingPassengers(this);
      }
    });
  }

  resume() {
    this.movable = true;
  }

  getOn(passenger: Passenger) {
    this.carriedPassengers.push(passenger);
  }

  getOff(passenger: Passenger) {
    this.carriedPassengers = this.carriedPassengers.filter(
      x => x !== passenger
    );
  }

  update() {
    this.updatePosition();
    this.updateWhichPlatformsBeside();
    this.updateCarriedPassengersPosition();
    this.renderer.update();
  }

  private callForArrivedPassengersAt(platform: Platform) {
    this.carriedPassengers.map(passenger => {
      passenger.checkShouldGetOffAt(platform);
    });
  }

  private isBeside(platform: Platform) {
    return (
      platform.start <= this.positionOnTrack &&
      this.positionOnTrack <= platform.end
    );
  }

  private updateCarriedPassengersPosition() {
    this.carriedPassengers.map(passenger => passenger.updatePosition());
  }

  private updateWhichPlatformsBeside() {
    this.track.getPlatformsBeside().map(platform => {
      // todo checkins can be optimised, not just here
      if (this.isBeside(platform)) {
        if (!platform.isChecked(this)) {
          platform.checkin(this);
        }
      } else {
        platform.checkout(this);
      }
    });
  }

  // todo do somehow shorter
  private updatePosition() {
    const percentage =
      this.positionOnTrack / this.track.getSegment().getLength();
    this.position = this.track
      .getSegment()
      .getBezier()
      .getPoint(percentage);
    this.rotation = this.track
      .getSegment()
      .getBezier()
      .getDirection(percentage);
  }
}
