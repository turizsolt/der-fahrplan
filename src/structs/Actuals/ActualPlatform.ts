import { Engine } from '../Interfaces/Engine';
import { Passenger } from './Passenger';
import { Side } from '../Interfaces/Side';
import { TrackBase } from '../Interfaces/TrackBase';
import { Coordinate } from '../Geometry/Coordinate';
import { Platform } from '../Interfaces/Platform';
import { Color } from '../Color';
import { injectable, inject } from 'inversify';
import { TYPES } from '../TYPES';
import { PlatformRenderer } from '../Renderers/PlatformRenderer';
import { ActualBaseBrick } from './ActualBaseBrick';
import { BaseRenderer } from '../Renderers/BaseRenderer';
import { PassengerGenerator } from './PassengerGenerator';
import { Store } from '../Interfaces/Store';

@injectable()
export class ActualPlatform extends ActualBaseBrick implements Platform {
  private position: Coordinate;
  private rotation: number;
  private carList: Engine[];
  private passengerList: Passenger[] = [];

  private track: TrackBase;
  private start: number;
  private end: number;
  private width: number;
  private side: Side;
  private color: Color;
  private removed: boolean = false;
  private pg: PassengerGenerator;

  @inject(TYPES.PlatformRenderer) private renderer: PlatformRenderer;

  getRenderer(): BaseRenderer {
    return this.renderer;
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
    track: TrackBase,
    start: number,
    end: number,
    width: number,
    side: Side,
    color: Color,
    pg: PassengerGenerator
  ): Platform {
    super.initStore();

    const segment = track.getSegment();
    const a = segment.getFirstPoint();
    const b = segment.getLastPoint();
    const segLen = segment.getLength();
    start = start * segLen;
    end = end * segLen;

    this.track = track;
    this.start = start;
    this.end = end;
    this.width = width;
    this.side = side;
    this.color = color;
    this.pg = pg;

    track.addPlatform(this);

    // TODO rewrite to more simple, and to follow curvy sections as well
    // new type like TrackSequence (startPos, [tracks], endPos)
    // create an object param in init

    var rot = new Coordinate(b.x - a.x, 0, b.z - a.z);
    const rot4 = Math.atan2(rot.x, rot.z);
    const rotLeft = rot4 - Math.PI / 2;
    const rotRight = rot4 + Math.PI / 2;

    var center = new Coordinate((b.x + a.x) / 2, 0, (b.z + a.z) / 2);

    var dist = 1.8 + width / 2;
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

  remove(): boolean {
    this.store.unregister(this);
    this.pg.removeFromList(this);
    this.removed = true;
    this.renderer.update();
    return true;
  }

  isRemoved(): boolean {
    return this.removed;
  }

  persist(): Object {
    return {
      id: this.getId(),
      type: 'Platform',

      track: this.track,
      start: this.start,
      end: this.end,
      side: this.side,
      color: {
        red: this.color.red,
        green: this.color.green,
        blue: this.color.blue
      },
      width: this.width
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(
      store.get(obj.track) as TrackBase,
      obj.start,
      obj.end,
      obj.width,
      obj.side,
      obj.color,
      null
    );
  }
}
