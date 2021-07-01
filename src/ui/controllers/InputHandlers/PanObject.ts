import * as BABYLON from 'babylonjs';
import { Vector3 } from 'babylonjs';
import { TickInputProps } from '../TickInputProps';

export class PanObject {
  private dx: number = 0;
  private dz: number = 0;
  private alpha: number = 0;
  private scale: number = 0;

  constructor(private camera: BABYLON.ArcRotateCamera) {
    this.initVars();
  }

  initVars(): void {
    this.alpha = this.camera.alpha;
    this.scale = this.camera.radius / 70;
    this.dx = 0;
    this.dz = 0;
  }

  up(modifier: number): void {
    this.dx += -Math.sin(this.alpha + Math.PI / 2) * this.scale * modifier;
    this.dz += Math.cos(this.alpha + Math.PI / 2) * this.scale * modifier;
  }

  down(modifier: number): void {
    this.dx +=
      -Math.sin(this.alpha + (Math.PI / 2) * 3) * this.scale * modifier;
    this.dz += Math.cos(this.alpha + (Math.PI / 2) * 3) * this.scale * modifier;
  }

  left(modifier: number): void {
    this.dx += -Math.sin(this.alpha + Math.PI) * this.scale * modifier;
    this.dz += Math.cos(this.alpha + Math.PI) * this.scale * modifier;
  }

  right(modifier: number): void {
    this.dx += -Math.sin(this.alpha) * this.scale * modifier;
    this.dz += Math.cos(this.alpha) * this.scale * modifier;
  }

  move(dx: number, dy: number): void {
    this.left(dx);
    this.up(dy);
  }

  updateCamera(props: TickInputProps) {
    if (this.dz !== 0 || this.dx !== 0) {
      this.camera.setPosition(
        new Vector3(
          props.camera.fromX + this.dx,
          props.camera.fromY,
          props.camera.fromZ + this.dz
        )
      );
      this.camera.setTarget(
        new Vector3(
          props.camera.targetX + this.dx,
          0,
          props.camera.targetZ + this.dz
        )
      );
      props.setFollowCamOff();
    }
  }
}
