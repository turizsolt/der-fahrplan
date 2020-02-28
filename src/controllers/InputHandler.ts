import { InputProps } from './InputProps';

export interface InputHandler {
  down(props: InputProps);
  up(downprops: InputProps, props: InputProps);
  move(downprops: InputProps, props: InputProps);
  click(props: InputProps);
  roam(props: InputProps);
}
