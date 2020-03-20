import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';

export class SelectInputHandler implements InputHandler {
  constructor() {}

  down(props: InputProps, event: PointerEvent): void {}

  roam(props: InputProps, event: PointerEvent): void {}

  move(downProps: InputProps, props: InputProps, event: PointerEvent): void {}

  click(downProps: InputProps, event: PointerEvent): void {}

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {}

  cancel(): void {}
}
