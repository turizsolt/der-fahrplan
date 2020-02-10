import { TrackJointRenderer } from './TrackJointRenderer';
import { Coordinate } from '../Coordinate';
import { TYPES } from '../TYPES';
import { babylonContainer } from '../inversify.config';

export class TrackJoint {
  readonly id: number;
  public position: Coordinate;
  public rotation: number;
  public removed: boolean = false;

  private renderer: TrackJointRenderer;

  constructor(x: number, z: number, rot: number) {
    this.id = (Math.random() * 1000000) | 0;

    this.position = new Coordinate(x, 0, z);
    this.rotation = rot;

    this.renderer = babylonContainer.get<TrackJointRenderer>(
      TYPES.TrackJointRenderer
    );
    this.renderer.init(this);
  }

  rotate(rot: number) {
    this.rotation = rot;
    this.renderer.update();
  }

  remove() {
    this.removed = true;
    this.renderer.update();
  }
}
