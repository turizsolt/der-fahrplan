import { InputProps } from '../InputProps';

export interface CreateEngineInputHandlerPlugin {
  init(): void;
  roam(props: InputProps): void;
  click(): void;
  cancel(): void;
}
