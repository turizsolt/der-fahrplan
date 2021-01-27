import { InputProps } from './InputProps';
import { TickInputProps } from './TickInputProps';

export interface InputHandler {
  down(props: InputProps, event: PointerEvent): void;
  up(downprops: InputProps, props: InputProps, event: PointerEvent): void;
  move(downprops: InputProps, props: InputProps, event: PointerEvent): void;
  click(props: InputProps, event: PointerEvent): void;
  roam(props: InputProps, event: PointerEvent): void;
  tick?(props: TickInputProps): void;
  setPanLock?(): void;
  cancel(): void;
}
