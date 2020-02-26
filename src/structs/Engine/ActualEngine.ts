import { Passenger } from '../Passenger/Passenger';
import { Track } from '../Track/Track';
import { TrackBase } from '../TrackBase/TrackBase';
import { EngineRenderer } from './EngineRenderer';
import { TYPES } from '../TYPES';
import { inject, injectable } from 'inversify';
import { Engine } from './Engine';
import { Platform } from '../Platform';
import { PositionOnTrack } from './PositionOnTrack';
import { Ray } from '../Geometry/Ray';

@injectable()
export class ActualEngine implements Engine {
  private positionOnTrack: PositionOnTrack;
  private carriedPassengers: Passenger[] = [];
  @inject(TYPES.EngineRenderer) private renderer: EngineRenderer;

  putOnTrack(track: Track): void {
    this.positionOnTrack = new PositionOnTrack(track, this);
    track.checkin(this);

    this.renderer.init(this);
    this.update();
  }

  getTrackOn(): TrackBase {
    return this.positionOnTrack.getTrack();
  }

  getRay(): Ray {
    return this.positionOnTrack.getRay();
  }

  forward(): void {
    this.positionOnTrack.move(1);
    this.update();
  }

  backward(): void {
    this.positionOnTrack.move(-1);
    this.update();
  }

  stop(): void {
    this.getTrackOn()
      .getPlatformsBeside()
      .map(platform => {
        if (this.positionOnTrack.isBeside(platform)) {
          this.callForArrivedPassengersAt(platform);
          platform.callForDepartingPassengers(this);
        }
      });
  }

  getOn(passenger: Passenger): void {
    this.carriedPassengers.push(passenger);
  }

  getOff(passenger: Passenger): void {
    this.carriedPassengers = this.carriedPassengers.filter(
      x => x !== passenger
    );
  }

  update(): void {
    this.updateWhichPlatformsBeside();
    this.updateCarriedPassengersPosition();
    this.renderer.update();
  }

  private callForArrivedPassengersAt(platform: Platform): void {
    this.carriedPassengers.map(passenger => {
      passenger.checkShouldGetOffAt(platform);
    });
  }

  private updateCarriedPassengersPosition(): void {
    this.carriedPassengers.map(passenger => passenger.updatePosition());
  }

  private updateWhichPlatformsBeside(): void {
    this.getTrackOn()
      .getPlatformsBeside()
      .map(platform => {
        // todo checkins can be optimised, not just here
        if (this.positionOnTrack.isBeside(platform)) {
          if (!platform.isChecked(this)) {
            platform.checkin(this);
          }
        } else {
          platform.checkout(this);
        }
      });
  }
}
