import { WhichEnd } from '../../../Interfaces/WhichEnd';
import { WagonControl } from './WagonControl';
import { WagonControlType } from './WagonControlType';

export class WagonControlNothing implements WagonControl {
  getControlType(): WagonControlType {
    return WagonControlType.Nothing;
  }

  getSelectedSide(): WhichEnd | null {
    return null;
  }

  onSelected(selected: boolean): void {}

  swapSelectedSide(): void {}

  onStocked(): void {}
}
