import { RoutePartReference } from "./RoutePartReference";

export interface RoutePartReferenceDuration extends RoutePartReference {
    getDuration: () => number;
}
