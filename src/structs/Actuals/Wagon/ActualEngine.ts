import { TYPES } from '../../TYPES';
import { inject, injectable } from 'inversify';
import { ActualBaseBrick } from '../ActualBaseBrick';
import { Engine } from '../../Interfaces/Engine';
import { PositionOnTrack } from '../Track/PositionOnTrack';
import { Passenger } from '../Passenger';
import { EngineRenderer } from '../../Renderers/EngineRenderer';
import { TrackBase } from '../../Interfaces/TrackBase';
import { Coordinate } from '../../Geometry/Coordinate';
import { Ray } from '../../Geometry/Ray';
import { Platform } from '../../Interfaces/Platform';
import { BaseRenderer } from '../../Renderers/BaseRenderer';
import { Store } from '../../Interfaces/Store';

@injectable()
export class ActualEngine extends ActualBaseBrick implements Engine {
  private positionOnTrack: PositionOnTrack;
  private carriedPassengers: Passenger[] = [];
  private removed: boolean = false;

  @inject(TYPES.EngineRenderer) private renderer: EngineRenderer;

  init(): Engine {
    super.initStore();
    return this;
  }

  putOnTrack(
    track: TrackBase,
    position: number = 0,
    direction: number = 1
  ): void {
    this.positionOnTrack = new PositionOnTrack(
      track,
      this,
      position,
      direction
    );
    //track.checkin(this);

    this.renderer.init(this);
    this.update();
  }

  getTrackOn(): TrackBase {
    return this.positionOnTrack.getTrack();
  }

  getRay(): Ray {
    return this.positionOnTrack.getRay();
  }

  getPosition(): Coordinate {
    return this.positionOnTrack.getRay().coord;
  }

  forward(): void {
    // to my B
    this.positionOnTrack.hop(1);
    this.update();
  }

  backward(): void {
    // to my A
    this.positionOnTrack.hop(-1);
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

  getRenderer(): BaseRenderer {
    return this.renderer;
  }

  remove(): boolean {
    this.removed = true;
    this.store.unregister(this);
    this.renderer.update();
    //this.getTrackOn().checkout(this);
    return true;
  }

  isRemoved(): boolean {
    return this.removed;
  }

  persist(): Object {
    return {
      id: this.getId(),
      type: 'Engine',

      track: this.positionOnTrack.getTrack().getId(),
      position: this.positionOnTrack.getRay().coord,
      direction: this.positionOnTrack.getRay().dirXZ
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init();
    this.putOnTrack(
      store.get(obj.track) as TrackBase,
      obj.position,
      obj.direction
    );
  }
}
