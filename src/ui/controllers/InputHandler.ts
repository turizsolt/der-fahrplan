import { InputProps } from './InputProps';

export interface InputHandler {
  down(props: InputProps, event: PointerEvent): void;
  up(downprops: InputProps, props: InputProps, event: PointerEvent): void;
  move(downprops: InputProps, props: InputProps, event: PointerEvent): void;
  click(props: InputProps, event: PointerEvent): void;
  roam(props: InputProps, event: PointerEvent): void;
  cancel(): void;
}
