import { InputProps } from './InputProps';

export interface InputHandler {
  down(props: InputProps);
  up(props: InputProps);
  move(props: InputProps);
}
