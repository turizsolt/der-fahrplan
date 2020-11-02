import { WhichEnd } from '../../../Interfaces/WhichEnd';
import { WagonControlType } from './WagonControlType';
import { WagonControlLocomotive } from './WagonControlLocomotive';

export class WagonControlControlCar extends WagonControlLocomotive {
  getControlType(): WagonControlType {
    return WagonControlType.ControlCar;
  }

  onSelected(selected: boolean): void {
    if (selected && this.selectedSide === null) {
      if (this.wagon.isAFree() && this.wagon.getTrain().hasLocomotive()) {
        this.selectedSide = WhichEnd.A;
      } else {
        this.selectedSide = null;
      }
    }
  }

  swapSelectedSide(): void {
    if (this.selectedSide === WhichEnd.A) {
      this.selectOtherEnd();
      this.wagon.update();
    }
  }

  onStocked(): void {
    if (this.selectedSide === WhichEnd.A && !this.wagon.isAFree()) {
      this.selectedSide = null;
    }
  }
}
