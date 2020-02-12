import { Passenger } from '../Passenger/Passenger';
import { Track } from '../Track/Track';
import { TrackBase } from '../TrackBase/TrackBase';
import { Coordinate } from '../Coordinate';
import { EngineRenderer } from './EngineRenderer';
import { TYPES } from '../TYPES';
import { inject, injectable } from 'inversify';
import { Engine } from './Engine';

@injectable()
export class ActualEngine implements Engine {
  private track: TrackBase;
  private position: Coordinate;
  private rotation: number;
  private positionOnTrack: number;
  private movable: boolean = true;
  private passengerList: Passenger[] = [];
  @inject(TYPES.EngineRenderer) private renderer: EngineRenderer;

  putOnTrack(track: Track) {
    this.track = track;
    this.position = track.A.point;
    this.positionOnTrack = 0;
    track.checkin(this);

    this.renderer.init(this);
    this.reposition();
  }

  forward() {
    if (!this.movable) return;

    this.positionOnTrack += 1;
    if (this.positionOnTrack > this.track.segment.length) {
      const trackLength = this.track.segment.length;
      if (this.track.B.connectedTo) {
        this.track.checkout(this);
        this.track.platformList.map(platform => {
          platform.checkout(this);
        });
        this.track = this.track.B.connectedTo;
        this.track.checkin(this);
        this.positionOnTrack -= trackLength;
      } else {
        this.positionOnTrack = trackLength;
      }
    }
    this.reposition();
  }

  backward() {
    if (!this.movable) return;

    this.positionOnTrack -= 1;
    if (this.positionOnTrack < 0) {
      if (this.track.A.connectedTo) {
        this.track.checkout(this);
        this.track.platformList.map(platform => {
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

    this.reposition();
  }

  stop() {
    this.movable = false;

    this.track.platformList.map(platform => {
      if (
        platform.start <= this.positionOnTrack &&
        this.positionOnTrack <= platform.end
      ) {
        this.passengerList.map(passenger => {
          passenger.checkPlatform(platform);
        });

        platform.callPassengers(this);
        console.log(
          'on platform',
          platform.no,
          platform.passengerList.map(x => `${x.id}->${x.to.no}`)
        );
      }
    });
    console.log('on train', this.passengerList.map(x => `${x.id}->${x.to.no}`));
  }

  resume() {
    this.movable = true;
  }

  getOn(passenger: Passenger) {
    this.passengerList.push(passenger);
  }

  getOff(passenger: Passenger) {
    this.passengerList = this.passengerList.filter(x => x !== passenger);
  }

  reposition() {
    if (this.track.I) {
      const t = this.positionOnTrack / this.track.segment.length;
      var p = new BABYLON.Vector3(
        (1 - t) * (1 - t) * this.track.A.point.x +
          2 * (1 - t) * t * this.track.I.x +
          t * t * this.track.B.point.x,
        0,
        (1 - t) * (1 - t) * this.track.A.point.z +
          2 * (1 - t) * t * this.track.I.z +
          t * t * this.track.B.point.z
      );
      var pd = new BABYLON.Vector3(
        2 * (1 - t) * (this.track.I.x - this.track.A.point.x) +
          2 * t * (this.track.B.point.x - this.track.I.x),
        0,
        2 * (1 - t) * (this.track.I.z - this.track.A.point.z) +
          2 * t * (this.track.B.point.z - this.track.I.z)
      );

      this.position = p;

      const rot = Math.atan2(pd.x, pd.z);
      this.rotation = rot;
    } else {
      const t = this.positionOnTrack / this.track.segment.length;
      var p = new BABYLON.Vector3(
        (1 - t) * this.track.A.point.x + t * this.track.B.point.x,
        0,
        (1 - t) * this.track.A.point.z + t * this.track.B.point.z
      );
      var pd = new BABYLON.Vector3(
        this.track.B.point.x - this.track.A.point.x,
        0,
        this.track.B.point.z - this.track.A.point.z
      );

      this.position = p;

      const rot = Math.atan2(pd.x, pd.z);
      this.rotation = rot;
    }

    this.track.platformList.map(platform => {
      if (
        platform.start <= this.positionOnTrack &&
        this.positionOnTrack <= platform.end
      ) {
        if (!platform.isChecked(this)) {
          platform.checkin(this);
        }
      } else {
        platform.checkout(this);
      }
    });

    this.passengerList.map(passenger => passenger.updatePosition());

    this.renderer.update();
  }

  getPosition(): Coordinate {
    return this.position;
  }
  getRotation(): number {
    return this.rotation;
  }
}
