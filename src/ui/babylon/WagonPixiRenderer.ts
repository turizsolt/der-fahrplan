import * as PIXI from 'pixi.js';
import { injectable } from 'inversify';
import { WagonRenderer } from '../../structs/Renderers/WagonRenderer';
import { WagonData } from '../../modules/Train/WagonData';
import { Ray } from '../../structs/Geometry/Ray';
import { TrackDirection } from '../../modules/Track/TrackDirection';
import { BasePixiRenderer } from './BasePixiRenderer';

@injectable()
export class WagonPixiRenderer extends BasePixiRenderer
  implements WagonRenderer {
  private rect: PIXI.Graphics;
  private front: PIXI.Graphics;

  private inited: boolean = false;

  init(wagon: WagonData) {
    this.rect = new PIXI.Graphics();
    this.rect.interactive = true;
    this.rect.buttonMode = true;
    this.rect.beginFill(0xff00ff);
    this.rect.drawRect(-7, -2, 14, 4);
    this.rect.rotation = 0;
    this.rect.endFill();
    this.rect.zIndex = 15;

    this.front = new PIXI.Graphics();
    this.front.interactive = true;
    this.front.buttonMode = true;
    this.front.beginFill(0x000000);
    this.front.drawCircle(0, 0, 2);
    this.front.endFill();
    this.front.zIndex = 16;

    this.rect.on('pointerdown', (event: PIXI.InteractionEvent) => {
      const x =
        (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
      const y =
        (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      globalThis.inputController.down({
        ...event,
        meshId: 'clickable-wagon-' + wagon.id,
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    this.rect.on('pointerup', (event: PIXI.InteractionEvent) => {
      const x =
        (event.data.global.x - globalThis.stage.x) / globalThis.stage.scale.x;
      const y =
        (event.data.global.y - globalThis.stage.y) / globalThis.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      globalThis.inputController.up({
        ...event,
        meshId: 'clickable-wagon-' + wagon.id,
        button: event.data.button
      });

      event.stopPropagation();
      event.data.originalEvent.stopPropagation();
    });

    globalThis.stage.addChild(this.rect);
    globalThis.stage.addChild(this.front);

    this.inited = true;
    this.update(wagon);
  }

  update(wagon: WagonData) {
    if (!this.inited) return;
    if (!wagon.ray) return;

    const ray = Ray.fromData(wagon.ray);
    this.rect.x = ray.coord.x;
    this.rect.y = ray.coord.z;
    this.rect.rotation =
      -ray.dirXZ +
      Math.PI / 2 +
      (wagon.appearanceFacing === TrackDirection.BA ? Math.PI : 0);

    const rayFront = Ray.fromData(wagon.rayA);
    this.front.x = rayFront.coord.x;
    this.front.y = rayFront.coord.z;

    // todo - port the rest

    /*
    const rayA = Ray.fromData(wagon.rayA);
    if (wagon.isFirst) {
      const matA = wagon.isTrainSelected
        ? wagon.isShunting
          ? MaterialName.ShuntingRed
          : MaterialName.SelectorRed
        : MaterialName.BedGray;
      this.selectedAMesh.position = CoordinateToBabylonVector3(rayA.coord);
      this.selectedAMesh.position.y = 10;
      this.selectedAMesh.material = this.meshProvider.getMaterial(matA);

      this.selectedAMesh.setEnabled(true);
      this.endAMesh.setEnabled(false);
    } else {
      this.endAMesh.position = CoordinateToBabylonVector3(rayA.coord);
      this.endAMesh.position.y = 10;
      this.endAMesh.material = this.meshProvider.getMaterial(
        MaterialName.SelectorRed
      );

      this.endAMesh.setEnabled(true);
      this.selectedAMesh.setEnabled(false);
    }
    */
  }
}
