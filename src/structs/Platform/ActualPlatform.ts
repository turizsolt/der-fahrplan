import { Engine } from '../Engine/Engine';
import { Passenger } from '../Passenger/Passenger';
import { Side } from './Side';
import { TrackBase } from '../TrackBase/TrackBase';
import { Coordinate } from '../Geometry/Coordinate';
import { Platform } from './Platform';
import { Color } from '../Color';
import { injectable, inject } from 'inversify';
import { TYPES } from '../TYPES';
import { PlatformRenderer } from './PlatformRenderer';

@injectable()
export class ActualPlatform implements Platform {
  private position: Coordinate;
  private rotation: number;
  private carList: Engine[];
  private passengerList: Passenger[] = [];

  private no: string;
  private track: TrackBase;
  private start: number;
  private end: number;
  private width: number;
  private side: Side;
  private color: Color;
  @inject(TYPES.PlatformRenderer) private renderer: PlatformRenderer;

  getId() {
    return this.no;
  }

  getWidth() {
    return this.width;
  }

  getLength() {
    return this.end - this.start;
  }

  getPosition(): Coordinate {
    return this.position;
  }
  getRotation(): number {
    return this.rotation;
  }
  getColor(): Color {
    return this.color;
  }

  init(
    no: string,
    track: TrackBase,
    start: number,
    end: number,
    width: number,
    side: Side,
    color: Color
  ): Platform {
    const segment = track.getSegment();
    const a = segment.getFirstPoint();
    const b = segment.getLastPoint();
    const segLen = segment.getLength();
    start = start * segLen;
    end = end * segLen;

    this.no = no;
    this.track = track;
    this.start = start;
    this.end = end;
    this.width = width;
    this.side = side;
    this.color = color;

    track.addPlatform(this);

    // TODO rewrite to more simple, and to follow curvy sections as well
    // new type like TrackSequence (startPos, [tracks], endPos)
    // create an object param in init

    var rot = new Coordinate(b.x - a.x, 0, b.z - a.z);
    const rot4 = Math.atan2(rot.x, rot.z);
    const rotLeft = rot4 - Math.PI / 2;
    const rotRight = rot4 + Math.PI / 2;

    var center = new Coordinate((b.x + a.x) / 2, 0, (b.z + a.z) / 2);

    var dist = 1.6 + width / 2;
    var len = Math.sqrt(
      Math.pow(Math.abs(a.x - b.x), 2) + Math.pow(Math.abs(a.z - b.z), 2)
    );
    var shift = new Coordinate(
      Math.sin(side === Side.Left ? rotLeft : rotRight) * 1,
      0,
      Math.cos(side === Side.Left ? rotLeft : rotRight) * 1
    );

    var dist2 = start + (end - start) / 2;
    var shift2 = new Coordinate(
      a.x + (rot.x / len) * dist2,
      0,
      a.z + (rot.z / len) * dist2
    );

    var height = new Coordinate(0, 0.75, 0);
    this.position = shift2.add(shift.scale(dist)).add(height);
    const rot1 = Math.atan2(rot.x, rot.z);
    this.rotation = rot1;

    this.carList = [];

    this.renderer.init(this);
    return this;
  }

  checkin(engine: Engine) {
    this.carList.push(engine);
  }

  checkout(engine: Engine) {
    this.carList = this.carList.filter(elem => elem !== engine);
  }

  isChecked(engine: Engine) {
    return this.carList.filter(elem => elem === engine).length > 0;
  }

  addPassenger(passenger: Passenger) {
    this.passengerList.push(passenger);
  }

  removePassenger(passenger: Passenger) {
    this.passengerList = this.passengerList.filter(x => x !== passenger);
  }

  callForDepartingPassengers(engine: Engine) {
    this.passengerList.map(x => x.checkTrain(engine));
  }

  isBeside(position: number): boolean {
    return this.start <= position && position <= this.end;
  }
}
