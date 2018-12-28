import { CarModel } from '../CarModel';
import { Coordinate } from 'src/Geometry/Coordinate';
import { Rectangle } from 'src/Geometry/Rectangle';
import { TrackModel } from 'src/Tiles/Track/TrackModel';

export class EngineModel extends CarModel {
    public static moveTo(engine:EngineModel, track: TrackModel, sleeper: number): EngineModel {
        return {
            ...CarModel.moveTo(engine, track, sleeper),
            moving: engine.moving,
            willStopOnTile: engine.willStopOnTile
        };
    }

    public static moveToAndStop(engine:EngineModel, track: TrackModel, sleeper: number): EngineModel {
        return {
            ...CarModel.moveTo(engine, track, sleeper),
            moving: 0,
            willStopOnTile: false
        };
    }
    
    public moving: number;
    public willStopOnTile: boolean;
    
    public constructor(id:string, center: Coordinate, box: Rectangle,  attachedA:string|null, attachedB:string|null, trackId: string, sleeper: number) {
        super("DieselEngine", id, center, box, attachedA, attachedB, trackId, sleeper);
        this.moving = 0;
        this.willStopOnTile = false;
    }
}
