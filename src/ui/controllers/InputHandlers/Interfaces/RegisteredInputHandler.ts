import { InputHandlerProp } from './InputHandlerProp';
import { InputHandlerFunction } from './InputHandlerFunction';

export interface RegisteredInputHandler {
  prop: InputHandlerProp;
  fn: InputHandlerFunction;
}
