import { InputHandlerProp } from './Interfaces/InputHandlerProp';
import { InputHandlerFunction } from './Interfaces/InputHandlerFunction';
import { RegisteredInputHandler } from './Interfaces/RegisteredInputHandler';
import { InputMod } from './Interfaces/InputMod';
import { InputType } from './Interfaces/InputType';

export class InputHandler {
  private registeredHandlers: RegisteredInputHandler[] = [];

  reg(prop: InputHandlerProp, fn: InputHandlerFunction): void {
    this.registeredHandlers.push({ prop, fn });
  }

  register(prop: InputHandlerProp, fn: InputHandlerFunction): void {
    this.registeredHandlers.push({ prop, fn });
  }

  handle(inputProp: InputHandlerProp, legacyEvent?: PointerEvent): boolean {
    for (let handler of this.registeredHandlers) {
      if (this.matches(inputProp, handler.prop)) {
        if (handler.fn(legacyEvent) !== false) {
          return true;
        }
      }
    }
    return false;
  }

  private matches(
    inputProp: InputHandlerProp,
    handlerProp: InputHandlerProp
  ): boolean {
    return (
      inputProp.input === handlerProp.input &&
      (inputProp.type === handlerProp.type ||
        handlerProp.type === InputType.MouseAny) &&
      (inputProp.mod === handlerProp.mod ||
        handlerProp.mod === InputMod.DontCare)
    );
  }
}
