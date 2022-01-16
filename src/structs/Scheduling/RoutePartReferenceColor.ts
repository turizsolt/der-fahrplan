import { RoutePartReference } from "./RoutePartReference";

export interface RoutePartReferenceColor extends RoutePartReference {
    getColor: () => string;
}
