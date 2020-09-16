import { WhichEnd } from '../../../Interfaces/WhichEnd';
import { WagonControlType } from './WagonControlType';

export interface WagonControl {
  getControlType(): WagonControlType;
  getSelectedSide(): WhichEnd | null;
  onSelected(selected: boolean): void;
  swapSelectedSide(): void;
  onStocked(): void;
}
