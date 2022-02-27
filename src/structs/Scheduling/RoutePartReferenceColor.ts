import { Color } from "../Color";
import { RoutePartReference } from "./RoutePartReference";

export interface RoutePartReferenceColor extends RoutePartReference {
    getColor: () => Color;
}
