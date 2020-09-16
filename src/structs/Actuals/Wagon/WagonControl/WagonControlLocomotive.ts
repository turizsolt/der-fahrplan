import { WhichEnd } from '../../../Interfaces/WhichEnd';
import { Wagon } from '../../../Interfaces/Wagon';
import { WagonControl } from './WagonControl';
import { WagonControlType } from './WagonControlType';

export class WagonControlLocomotive implements WagonControl {
  private selectedSide: WhichEnd | null = null;

  constructor(private wagon: Wagon) {}

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
    if (this.selectedSide === WhichEnd.A && this.wagon.isBFree()) {
      this.selectedSide = WhichEnd.B;
      this.wagon.update();
    } else if (this.selectedSide === WhichEnd.B && this.wagon.isAFree()) {
      this.selectedSide = WhichEnd.A;
      this.wagon.update();
    }
  }

  onStocked(): void {
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
    }
  }
}
