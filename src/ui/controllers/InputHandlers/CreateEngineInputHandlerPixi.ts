import * as PIXI from 'pixi.js';
import { InputProps } from '../InputProps';
import { CreateEngineInputHandlerPlugin } from './CreateEngineInputHandlerPlugin';

export class CreateEngineInputHandlerPixi
  implements CreateEngineInputHandlerPlugin {
  constructor() {}
  init() {}

  click() {}

  roam(props: InputProps) {}

  cancel() {}
}
