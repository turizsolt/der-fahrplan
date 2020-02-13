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
    if (this.positionOnTrack > this.track.getSegment().getLength()) {
      const trackLength = this.track.getSegment().getLength();
      if (this.track.getB().connectedTo) {
        this.track.checkout(this);
        this.track.getPlatformsBeside().map(platform => {
          platform.checkout(this);
        });
        this.track = this.track.getB().connectedTo;
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
      if (this.track.getA().connectedTo) {
        this.track.checkout(this);
        this.track.getPlatformsBeside().map(platform => {
          platform.checkout(this);
        });
        this.track = this.track.getA().connectedTo;
        this.track.checkin(this);
        const prevTrackLength = this.track.getSegment().getLength();
        this.positionOnTrack += prevTrackLength;
      } else {
        this.positionOnTrack = 0;
      }
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
