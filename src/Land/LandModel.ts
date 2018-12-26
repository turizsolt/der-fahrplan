import { TileModel } from '../Tiles/TileModel';
import { PassengerCarModel } from '../Car/PassengerCar/PassengerCarModel';
import { EngineModel } from '../Car/Engine/EngineModel';

export class LandModel {
    public cars: PassengerCarModel[];
    public engines: EngineModel[];
    public platforms: TileModel[];
    public tracks: TileModel[];    
}
