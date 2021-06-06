import { NewInputHander } from './NewInputHandler';
import { Input } from './Interfaces/Input';
import { InputMod } from './Interfaces/InputMod';
import { InputType } from './Interfaces/InputType';
import { keyUp } from './Interfaces/Helpers';

export class NewSelectInputHandler extends NewInputHander {
  constructor() {
    super();

    this.register(
      {
        input: Input.MouseClick,
        mod: InputMod.None,
        type: InputType.MouseLeft
      },
      () => {
        console.log('clicked');
        return true;
      }
    );

    this.reg(keyUp('Q'), () => {
      console.log('Q');
    });
  }
}
