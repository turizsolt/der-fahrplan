import { RoutePart } from "./RoutePart";

export interface RoutePartStop extends RoutePart {
    setDuration(frames: number): void;
    setStopping(stopping: boolean): void;
}
