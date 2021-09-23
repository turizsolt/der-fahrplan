import { BaseStorable } from "../../../structs/Interfaces/BaseStorable";

export interface SightMarker {
    type: string;
    speed: number;
    object: BaseStorable;
    distance: number;
}
