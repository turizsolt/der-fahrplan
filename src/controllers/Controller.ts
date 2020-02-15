import * as BABYLON from 'babylonjs';

export class Controller {
  private viewMode = 0;
  private camera: BABYLON.Camera;
  private canvas: HTMLElement;

  setCameraAndCanvas(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;
    this.setViewMode(0);
  }

  nextViewMode() {
    this.setViewMode((this.viewMode + 1) % 2);
  }

  setViewMode(viewMode) {
    this.viewMode = viewMode;

    switch (this.viewMode) {
      case 0:
        this.camera.attachControl(this.canvas, true);
        return;
      case 1:
        this.camera.detachControl(this.canvas);
        return;
    }
  }

  getViewMode() {
    return this.viewMode;
  }
}
