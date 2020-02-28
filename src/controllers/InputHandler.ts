import { InputProps } from './InputProps';

export interface InputHandler {
  down(props: InputProps): void;
  up(downprops: InputProps, props: InputProps): void;
  move(downprops: InputProps, props: InputProps): void;
  click(props: InputProps): void;
  roam(props: InputProps): void;
  cancel(): void;
}
