import { Engine } from '../Interfaces/Engine';
import { Platform } from '../Interfaces/Platform';
import { PassengerRenderer } from '../Renderers/PassengerRenderer';
import { Coordinate } from '../Geometry/Coordinate';
import { TYPES } from '../TYPES';
import { Passenger } from '../Interfaces/Passenger';
import { ActualBaseBrick } from './ActualBaseBrick';
import { BaseRenderer } from '../Renderers/BaseRenderer';
import { injectable, inject } from 'inversify';

@injectable()
export class ActualPassenger extends ActualBaseBrick implements Passenger {
  getRenderer(): BaseRenderer {
    return this.renderer;
  }
  persist(): Object {
    throw new Error('Method not implemented.');
  }
  load(obj: Object, store: import('../Interfaces/Store').Store): void {
    throw new Error('Method not implemented.');
  }
  public onPlatform: Platform = null;
  public onEngine: Engine = null;
  public position: Coordinate;
  public offset: Coordinate;
  @inject(TYPES.PassengerRenderer) private renderer: PassengerRenderer;
  private to: Platform;
  private from: Platform;

  init(to: Platform, from: Platform) {
    super.initStore(TYPES.Passenger);
    this.to = to;
    this.from = from;

    this.onPlatform = from;

    const dist = Math.random() * 2;
    const rad = Math.random() * Math.PI * 2;
    this.offset = new Coordinate(
      Math.sin(rad) * dist,
      2.5,
      Math.cos(rad) * dist
    );

    this.position = from.getPosition().add(this.offset);

    this.renderer.init(this);
    return this;
  }

  updatePosition() {
    if (this.onPlatform) {
      this.position = this.onPlatform.getPosition().add(this.offset);
    } else if (this.onEngine) {
      this.position = this.onEngine.getPosition().add(this.offset);
    }
    this.renderer.update();
  }

  checkTrain(engine: Engine) {
    engine.getOn(this);
    this.onEngine = engine;

    this.onPlatform.removePassenger(this);
    this.onPlatform = null;

    this.updatePosition();
  }

  isArrivedAt(platform: Platform) {
    return platform === this.to;
  }

  checkShouldGetOffAt(platform: Platform) {
    if (this.isArrivedAt(platform)) {
      this.getOff();
    }
  }

  getOff() {
    this.onEngine.getOff(this);
    this.onEngine = null;

    this.updatePosition();
  }

  getPosition(): Coordinate {
    return this.position;
  }

  getTo(): Platform {
    return this.to;
  }

  isOnPlatformOrEngine(): boolean {
    return !!this.onEngine || !!this.onPlatform;
  }
}
