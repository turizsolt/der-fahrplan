import { Engine } from '../Engine/Engine';
import { Platform } from '../Platform';
import { PassengerRenderer } from './PassengerRenderer';
import { Coordinate } from '../Coordinate';
import { TYPES } from '../TYPES';
import { babylonContainer } from '../inversify.config';

export class Passenger {
  readonly id: number;
  public onPlatform: Platform = null;
  public onEngine: Engine = null;
  public position: Coordinate;
  public shift: Coordinate;
  private renderer: PassengerRenderer;

  constructor(readonly to: Platform, readonly from: Platform) {
    this.id = (Math.random() * 1000000) | 0;
    this.onPlatform = from;

    const dist = Math.random() * 2;
    const rad = Math.random() * Math.PI * 2;
    this.shift = new Coordinate(Math.sin(rad) * dist, 0, Math.cos(rad) * dist);

    this.position = from.position
      .clone()
      .add(new Coordinate(0, 2.5, 0))
      .add(this.shift);

    this.renderer = babylonContainer.get<PassengerRenderer>(
      TYPES.PassengerRenderer
    );
    this.renderer.init(this);
  }

  updatePosition() {
    if (this.onPlatform) {
      this.position = this.onPlatform.position
        .clone()
        .add(new Coordinate(0, 2.5, 0).add(this.shift));
    } else if (this.onEngine) {
      this.position = this.onEngine.position
        .clone()
        .add(new Coordinate(0, 2.5, 0).add(this.shift));
    }
    this.renderer.update();
  }

  checkTrain(engine: Engine) {
    console.log('check engine', this.id);
    engine.getOn(this);
    this.onEngine = engine;

    this.onPlatform.removePassenger(this);
    this.onPlatform = null;

    this.updatePosition();
  }

  checkPlatform(platform: Platform) {
    console.log('check platform', this.id);
    if (platform === this.to) {
      this.onEngine.getOff(this);
      this.onEngine = null;

      this.updatePosition();
    }
  }
}
