import { Input } from './Input';
import { InputType } from './InputType';
import { InputMod } from './InputMod';

export interface InputHandlerProp {
  input: Input;
  type: InputType | string;
  mod: InputMod;
}
