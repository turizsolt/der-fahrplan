import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from './converters/CoordinateToBabylonVector3';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { MeshProvider } from './MeshProvider';
import { TYPES } from '../../di/TYPES';
import { WagonRenderer } from '../../structs/Renderers/WagonRenderer';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { MaterialName } from './MaterialName';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { WagonMovingState } from '../../structs/Actuals/Wagon/WagonMovingState';
import { WagonControlType } from '../../structs/Actuals/Wagon/WagonControl/WagonControlType';

@injectable()
export class WagonBabylonRenderer extends BaseBabylonRenderer
  implements WagonRenderer {
  private mesh: BABYLON.AbstractMesh;
  private selectedMesh: BABYLON.AbstractMesh;
  private wagon: Wagon;
  readonly scene: BABYLON.Scene;

  private endAMesh: BABYLON.AbstractMesh;
  private endBMesh: BABYLON.AbstractMesh;

  private selectedAMesh: BABYLON.AbstractMesh;
  private selectedBMesh: BABYLON.AbstractMesh;

  @inject(TYPES.FactoryOfMeshProvider)
  private meshProviderFactory: () => MeshProvider;
  private meshProvider: MeshProvider;

  private inited: boolean = false;

  init(engine: Wagon) {
    this.meshProvider = this.meshProviderFactory();
    this.wagon = engine;

    this.mesh = this.meshProvider.createWagonMesh(
      this.wagon.getAppearanceId(),
      'clickable-wagon-' + this.wagon.getId()
    );
    this.mesh.setEnabled(true);

    this.selectedMesh = this.meshProvider.createSelectorMesh();
    this.selectedMesh.setEnabled(false);

    this.endAMesh = this.meshProvider.createWagonEndMesh(
      'clickable-wagon-' + this.wagon.getId() + '-endA'
    );
    this.endBMesh = this.meshProvider.createWagonEndMesh(
      'clickable-wagon-' + this.wagon.getId() + '-endB'
    );

    this.selectedAMesh = this.meshProvider.createSelectorMesh();
    this.selectedBMesh = this.meshProvider.createSelectorMesh();

    this.inited = true;
    this.update();
  }

  update() {
    if (!this.inited) return;

    if (this.wagon.isRemoved()) {
      this.mesh.setEnabled(false);
      this.selectedMesh.setEnabled(false);
      this.selectedAMesh.setEnabled(false);
      this.selectedBMesh.setEnabled(false);
      this.endAMesh.setEnabled(false);
      this.endBMesh.setEnabled(false);
    } else {
      const ray = this.wagon.getRay();
      this.mesh.position = CoordinateToBabylonVector3(ray.coord);
      this.mesh.position.y = 4.2;
      this.mesh.rotation.y = ray.dirXZ + Math.PI / 2;

      if (
        this.wagon.getControlType() !== WagonControlType.Nothing ||
        !this.wagon.isSelected()
      ) {
        this.selectedMesh.setEnabled(false);
      } else {
        this.selectedMesh.position = CoordinateToBabylonVector3(ray.coord);
        this.selectedMesh.position.y = 10;
      }

      if (
        this.wagon.getMovingState() === WagonMovingState.Moving ||
        this.wagon.isAFree()
      ) {
        this.endAMesh.setEnabled(false);
      } else {
        this.endAMesh.setEnabled(true);

        this.endAMesh.position = CoordinateToBabylonVector3(
          this.wagon.getA().positionOnTrack.getRay().coord
        );
        this.endAMesh.position.y = 10;
        this.endAMesh.material = this.wagon.getA().hasConnectedEndOf()
          ? this.meshProvider.getMaterial(MaterialName.SelectorRed)
          : this.meshProvider.getMaterial(MaterialName.BedGray);
      }

      if (
        this.wagon.getMovingState() === WagonMovingState.Moving ||
        this.wagon.isBFree()
      ) {
        this.endBMesh.setEnabled(false);
      } else {
        this.endBMesh.setEnabled(true);
        this.endBMesh.position = CoordinateToBabylonVector3(
          this.wagon.getB().positionOnTrack.getRay().coord
        );
        this.endBMesh.position.y = 10;
        this.endBMesh.material = this.wagon.getB().hasConnectedEndOf()
          ? this.meshProvider.getMaterial(MaterialName.SelectorRed)
          : this.meshProvider.getMaterial(MaterialName.BedGray);
      }

      let matA = null;
      let matB = null;

      if (this.wagon.getControlType() !== WagonControlType.Nothing) {
        if (this.wagon.isAFree()) matA = MaterialName.BedGray;
        if (this.wagon.isAFree() && this.wagon.getSelectedSide() === WhichEnd.A)
          matA = MaterialName.SleeperBrown;
        if (
          this.wagon.isSelected() &&
          this.wagon.getSelectedSide() !== WhichEnd.B
        )
          matA = MaterialName.SelectorRed;

        if (this.wagon.getControlType() !== WagonControlType.ControlCar) {
          if (this.wagon.isBFree()) matB = MaterialName.BedGray;
          if (
            this.wagon.isBFree() &&
            this.wagon.getSelectedSide() === WhichEnd.B
          )
            matB = MaterialName.SleeperBrown;
          if (
            this.wagon.isSelected() &&
            this.wagon.getSelectedSide() === WhichEnd.B
          )
            matB = MaterialName.SelectorRed;
        } else {
          if (!this.wagon.getTrain().hasLocomotive()) {
            matA = null;
          }
        }
      }

      if (!matA) {
        this.selectedAMesh.setEnabled(false);
      } else {
        this.selectedAMesh.setEnabled(true);
        this.selectedAMesh.position = CoordinateToBabylonVector3(
          ray.fromHere(0, -5).coord
        );
        this.selectedAMesh.position.y = 10;
        this.selectedAMesh.material = this.meshProvider.getMaterial(matA);
      }

      if (!matB) {
        this.selectedBMesh.setEnabled(false);
      } else {
        this.selectedBMesh.setEnabled(true);
        this.selectedBMesh.position = CoordinateToBabylonVector3(
          ray.fromHere(0, 5).coord
        );
        this.selectedBMesh.position.y = 10;
        this.selectedBMesh.material = this.meshProvider.getMaterial(matB);
      }
    }
  }

  process(command: string) {
    switch (command) {
      case 'forward':
        this.wagon.accelerate();
        break;

      case 'backward':
        this.wagon.break();
        break;

      case 'shuntForward':
        this.wagon.shuntForward();
        break;

      case 'shuntBackward':
        this.wagon.shuntBackward();
        break;

      case 'stop':
        this.wagon.stop();
        break;

      case 'endA':
        this.wagon.disconnect(WhichEnd.A);
        break;

      case 'endB':
        this.wagon.disconnect(WhichEnd.B);
        break;

      case 'swapSide':
        this.wagon.swapSelectedSide();
        break;

      case 'swapEnds':
        this.wagon.swapEnds();
        break;

      case 'detach':
        this.wagon.detach();
        break;

      case 'delete':
        this.wagon.remove();
        break;
    }
  }
}
