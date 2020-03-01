import { Engine } from '../Engine/Engine';
import { Platform } from '../Platform/Platform';
import { PassengerRenderer } from './PassengerRenderer';
import { Coordinate } from '../Geometry/Coordinate';
import { TYPES } from '../TYPES';
import { babylonContainer } from '../inversify.config';

export class Passenger {
  readonly id: number;
  public onPlatform: Platform = null;
  public onEngine: Engine = null;
  public position: Coordinate;
  public offset: Coordinate;
  private renderer: PassengerRenderer;

  constructor(readonly to: Platform, readonly from: Platform) {
    this.id = (Math.random() * 1000000) | 0;
    this.onPlatform = from;

    const dist = Math.random() * 2;
    const rad = Math.random() * Math.PI * 2;
    this.offset = new Coordinate(
      Math.sin(rad) * dist,
      2.5,
      Math.cos(rad) * dist
    );

    this.position = from.getPosition().add(this.offset);

    this.renderer = babylonContainer.get<PassengerRenderer>(
      TYPES.PassengerRenderer
    );
    this.renderer.init(this);
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
}
