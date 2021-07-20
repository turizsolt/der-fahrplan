import { Coordinate } from '../../../../structs/Geometry/Coordinate';

export interface CreatePlatformInputHandlerPlugin {
  init(): void;
  down(renderable: boolean, point?: Coordinate): void;
  roam(renderable: boolean, point?: Coordinate): void;
  move(renderable: boolean, point?: Coordinate): void;
  up(): void;
  click(): void;
  cancel(): void;
}
