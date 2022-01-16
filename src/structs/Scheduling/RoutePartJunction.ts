import { RoutePart } from "./RoutePart";

export interface RoutePartJunction extends RoutePart {
    setDuration(frames: number): void;
}
