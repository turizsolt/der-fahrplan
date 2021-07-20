import { InputProps } from '../../InputProps';

export interface TrackInputHandlerPlugin {
  init(): void;
  down(props: InputProps): void;
  roam(props: InputProps): void;
  move(downProps: InputProps, props: InputProps): void;
  up(downProps: InputProps, props: InputProps): void;
  cancel(): void;
  wheel(dir: number): void;
}
