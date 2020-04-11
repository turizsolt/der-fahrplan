import { Passenger } from '../Interfaces/Passenger';
import { Side } from '../Interfaces/Side';
import { TrackBase } from '../Interfaces/TrackBase';
import { Coordinate } from '../Geometry/Coordinate';
import { Platform } from '../Interfaces/Platform';
import { Color } from '../Color';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/TYPES';
import { PlatformRenderer } from '../Renderers/PlatformRenderer';
import { BaseRenderer } from '../Renderers/BaseRenderer';
import { Store } from '../Interfaces/Store';
import { LineSegmentChain } from '../Geometry/LineSegmentChain';
import { Station } from '../Scheduling/Station';
import { Left, Right } from '../Geometry/Directions';
import { Boardable } from '../../mixins/Boardable';
import { ActualBaseBrick } from './ActualBaseBrick';
import { applyMixins } from '../../mixins/ApplyMixins';

export interface ActualPlatform extends Boardable {}
const doApply = () => applyMixins(ActualPlatform, [], [Boardable]);
@injectable()
export class ActualPlatform extends ActualBaseBrick implements Platform {
  private boardable: Boardable = new Boardable();

  private position: Coordinate;
  private rotation: number;

  private track: TrackBase;
  private start: number;
  private end: number;
  private startPerc: number;
  private endPerc: number;
  private width: number;
  private side: Side;
  private station: Station;
  private no: string;
  private removed: boolean = false;

  @inject(TYPES.PlatformRenderer) private renderer: PlatformRenderer;

  board(passenger: Passenger): Coordinate {
    this.boardable.board(passenger);

    if (!this.position) return null;

    const chain = this.getLineSegmentChain();
    const length = chain.getLength();
    const at = Math.random() * length;
    const ray = chain.getRayByDistance(at);
    const w = 2.8 + Math.random() * (this.width - 1);
    const x = ray.fromHere(this.side === Side.Left ? Left : Right, w);
    return x.coord;
  }

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
    return this.station ? this.station.getColor() : Color.White();
  }

  getLineSegmentChain(): LineSegmentChain {
    const p1 = this.track
      .getSegment()
      .getBezier()
      .getPoint(this.startPerc);

    const p2 = this.track
      .getSegment()
      .getBezier()
      .getPoint(this.endPerc);

    //console.log('p1', p1);
    //console.log('p2', p2);

    const chain = this.track.getSegment().getLineSegmentChain();

    const chain2 = chain.getChainFromPoint(chain.project(p1).coord);
    const chain3 = chain2.getChainToPoint(chain2.project(p2).coord);

    // console.log('pch1', chain.getRays().map(x => x.coord));
    // console.log('pch2', chain2.getRays().map(x => x.coord));
    // console.log('pch3', chain3.getRays().map(x => x.coord));
    return chain3;
  }

  isPartOfStation(station: Station): boolean {
    for (let point of this.getLineSegmentChain().getPoints()) {
      if (station.getCircle().isPointInside(point)) {
        return true;
      }
    }
    return (
      this.getLineSegmentChain().getIntersectionsWithCirlce(station.getCircle())
        .length > 0
    );
  }

  setStation(station: Station): void {
    this.station = station;
    this.renderer.update();
  }

  getStation(): Station {
    return this.station;
  }

  init(
    track: TrackBase,
    start: number,
    end: number,
    side: Side,
    width: number = 5
  ): Platform {
    super.initStore(TYPES.Platform);

    const segment = track.getSegment();
    const a = segment.getFirstPoint();
    const b = segment.getLastPoint();
    const segLen = segment.getLength();

    this.startPerc = start;
    this.endPerc = end;

    start = start * segLen;
    end = end * segLen;

    this.track = track;
    this.start = start;
    this.end = end;
    this.width = width;
    this.side = side;

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

    this.renderer.init(this);

    this.store
      .getFiltered(x => x.constructor.name === 'ActualStation')
      .forEach(st => {
        const station = st as Station;
        if (this.isPartOfStation(station)) {
          station.addPlatform(this);
        }
      });
    this.no = '';

    return this;
  }

  initX(station: Station, no: string): Platform {
    super.initStore(TYPES.Platform);
    this.boardable.init();
    this.position = null;
    this.no = no;
    station.addPlatform(this);
    return this;
  }

  getNo(): string {
    return this.no;
  }

  isBeside(position: number): boolean {
    return this.start <= position && position <= this.end;
  }

  remove(): boolean {
    this.store.unregister(this);
    this.removed = true;
    if (this.station) {
      this.station.removePlatform(this);
      this.station = null;
    }
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
      width: this.width
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(
      store.get(obj.track) as TrackBase,
      obj.start,
      obj.end,
      obj.side,
      obj.width
    );
  }
}
doApply();
