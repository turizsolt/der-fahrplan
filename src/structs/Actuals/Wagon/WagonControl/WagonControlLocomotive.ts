import { WhichEnd } from '../../../Interfaces/WhichEnd';
import { Wagon } from '../../../Interfaces/Wagon';
import { WagonControl } from './WagonControl';
import { WagonControlType } from './WagonControlType';

export class WagonControlLocomotive implements WagonControl {
  protected selectedSide: WhichEnd | null = null;

  constructor(protected wagon: Wagon) {}

  getControlType(): WagonControlType {
    return WagonControlType.Locomotive;
  }

  getSelectedSide(): WhichEnd | null {
    return this.selectedSide;
  }

  onSelected(selected: boolean): void {
    if (selected && this.selectedSide === null) {
      if (this.wagon.isAFree()) {
        this.selectedSide = WhichEnd.A;
      } else if (this.wagon.isBFree()) {
        this.selectedSide = WhichEnd.B;
      } else {
        this.selectedSide = null;
      }
    }
  }

  swapSelectedSide(): void {
    if (!!this.wagon.getControlingWagon()) return;

    if (this.selectedSide === WhichEnd.A) {
      if (this.wagon.isBFree()) {
        this.selectedSide = WhichEnd.B;
      } else {
        this.selectOtherEnd();
      }
    } else if (this.selectedSide === WhichEnd.B) {
      if (this.wagon.isAFree()) {
        this.selectedSide = WhichEnd.A;
      } else {
        this.selectOtherEnd();
      }
    } else {
      this.selectOtherEnd();
    }
    this.wagon.update();
  }

  protected selectOtherEnd(): void {
    let candidate: Wagon = null;
    if (!this.wagon.isAFree()) {
      const wagon = this.wagon.getLastWagon(WhichEnd.A);
      if (this.isWagonSelectable(wagon)) {
        candidate = wagon;
      }
    }
    if (!candidate && !this.wagon.isBFree()) {
      const wagon = this.wagon.getLastWagon(WhichEnd.B);
      if (this.isWagonSelectable(wagon)) {
        candidate = wagon;
      }
    }
    if (!candidate) {
      for (let wagon of this.wagon.getTrain().getWagons()) {
        if (this.isWagonSelectable(wagon)) {
          candidate = wagon;
          break;
        }
      }
    }

    if (candidate) {
      candidate.select();
    }
  }

  protected isWagonSelectable(wagon: Wagon): boolean {
    if (wagon === this.wagon) return false;

    if (wagon.getControlType() === WagonControlType.Locomotive) {
      return true;
    } else if (
      wagon.getControlType() === WagonControlType.ControlCar &&
      wagon.isAFree() &&
      wagon.getTrain().hasLocomotive()
    ) {
      return true;
    }
    return false;
  }

  onStocked(): void {
    /*
    if (this.selectedSide === WhichEnd.A && !this.wagon.isAFree()) {
      if (this.wagon.isBFree()) {
        this.selectedSide = WhichEnd.B;
      } else {
        this.selectedSide = null;
      }
    } else if (this.selectedSide === WhichEnd.B && !this.wagon.isBFree()) {
      if (this.wagon.isAFree()) {
        this.selectedSide = WhichEnd.A;
      } else {
        this.selectedSide = null;
      }
    }*/
  }
}
