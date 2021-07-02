import { InputHandler } from './InputHandler';
import { keyUp } from './Interfaces/Helpers';
import { Store } from '../../../structs/Interfaces/Store';

export class GameSpeedInputHandler extends InputHandler {
  constructor(private store: Store) {
    super();

    this.reg(keyUp('`'), () => this.store.setTickSpeed(0));
    this.reg(keyUp('0'), () => this.store.setTickSpeed(0));
    this.reg(keyUp('1'), () => this.store.setTickSpeed(1));
    this.reg(keyUp('2'), () => this.store.setTickSpeed(2));
    this.reg(keyUp('3'), () => this.store.setTickSpeed(3));
    this.reg(keyUp('4'), () => this.store.setTickSpeed(4));
    this.reg(keyUp('5'), () => this.store.setTickSpeed(5));

    this.reg(keyUp(' '), () => {
      if (this.store.getTickSpeed() === 0) {
        this.store.setTickSpeed(1);
      } else {
        this.store.setTickSpeed(0);
      }
    });
  }
}
