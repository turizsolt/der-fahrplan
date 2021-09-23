import { Coordinate } from '../../../../structs/Geometry/Coordinate';

export interface BlockJointInputHandlerPlugin {
  init(): void;
  roam(renderable: boolean, point?: Coordinate): void;
  click(): void;
  cancel(): void;
}
