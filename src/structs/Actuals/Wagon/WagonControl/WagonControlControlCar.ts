import { WhichEnd } from '../../../Interfaces/WhichEnd';
import { Wagon } from '../../../Interfaces/Wagon';
import { WagonControl } from './WagonControl';
import { WagonControlType } from './WagonControlType';

export class WagonControlControlCar implements WagonControl {
  private selectedSide: WhichEnd | null = null;

  constructor(private wagon: Wagon) {}

  getControlType(): WagonControlType {
    return WagonControlType.ControlCar;
  }

  getSelectedSide(): WhichEnd | null {
    return this.selectedSide;
  }

  onSelected(selected: boolean): void {
    if (selected && this.selectedSide === null) {
      if (this.wagon.isAFree()) {
        this.selectedSide = WhichEnd.A;
      } else {
        this.selectedSide = null;
      }
    }
  }

  swapSelectedSide(): void {}

  onStocked(): void {
    if (this.selectedSide === WhichEnd.A && !this.wagon.isAFree()) {
      this.selectedSide = null;
    }
  }
}
