import { Coordinate } from '../../../../structs/Geometry/Coordinate';

export interface CreateWaitingHallInputHandlerPlugin {
    init(): void;
    setFrom(renderable: boolean, point?: Coordinate): void;
    setTo(renderable: boolean, point?: Coordinate): void;
    up(): void;
    click(): void;
    cancel(): void;
}
