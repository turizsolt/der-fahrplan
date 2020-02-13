import { Passenger } from '../Passenger/Passenger';
import { Track } from '../Track/Track';
import { TrackBase } from '../TrackBase/TrackBase';
import { Coordinate } from '../Geometry/Coordinate';
import { EngineRenderer } from './EngineRenderer';
import { TYPES } from '../TYPES';
import { inject, injectable } from 'inversify';
import { Engine } from './Engine';
import { Platform } from '../Platform';
import { Bezier } from '../Geometry/Bezier';

@injectable()
export class ActualEngine implements Engine {
  private track: TrackBase;
  private position: Coordinate;
  private rotation: number;
  private positionOnTrack: number;
  private movable: boolean = true;
  private carriedPassengers: Passenger[] = [];
  @inject(TYPES.EngineRenderer) private renderer: EngineRenderer;

  putOnTrack(track: Track) {
    this.track = track;
    this.position = track.A.point;
    this.positionOnTrack = 0;
    track.checkin(this);

    this.renderer.init(this);
    this.update();
  }

  getPosition(): Coordinate {
    return this.position;
  }

  getRotation(): number {
    return this.rotation;
  }

  // TODO should have refactor, when AB-BA pairing will considering as well
  forward() {
    if (!this.movable) return;

    this.positionOnTrack += 1;
    if (this.positionOnTrack > this.track.segment.length) {
      const trackLength = this.track.segment.length;
      if (this.track.B.connectedTo) {
        this.track.checkout(this);
        this.track.platformsBeside.map(platform => {
          platform.checkout(this);
        });
        this.track = this.track.B.connectedTo;
        this.track.checkin(this);
        this.positionOnTrack -= trackLength;
      } else {
        this.positionOnTrack = trackLength;
      }
    }
    this.update();
  }

  // TODO should have refactor, when AB-BA pairing will considering as well
  backward() {
    if (!this.movable) return;

    this.positionOnTrack -= 1;
    if (this.positionOnTrack < 0) {
      if (this.track.A.connectedTo) {
        this.track.checkout(this);
        this.track.platformsBeside.map(platform => {
          platform.checkout(this);
        });
        this.track = this.track.A.connectedTo;
        this.track.checkin(this);
        const prevTrackLength = this.track.segment.length;
        this.positionOnTrack += prevTrackLength;
      } else {
        this.positionOnTrack = 0;
      }
    }

    this.update();
  }

  stop() {
    this.movable = false;

    this.track.platformsBeside.map(platform => {
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
    this.track.platformsBeside.map(platform => {
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
    if (this.track.I) {
      const percentage = this.positionOnTrack / this.track.segment.length;
      this.position = Bezier.pointOnCurve(
        percentage,
        this.track.A.point,
        this.track.I,
        this.track.B.point
      );
      this.rotation = Bezier.directionOnCurve(
        percentage,
        this.track.A.point,
        this.track.I,
        this.track.B.point
      );
    } else {
      const percentage = this.positionOnTrack / this.track.segment.length;
      this.position = Bezier.pointOnLine(
        percentage,
        this.track.A.point,
        this.track.B.point
      );
      this.rotation = Bezier.directionOnLine(
        this.track.A.point,
        this.track.B.point
      );
    }
  }
}
