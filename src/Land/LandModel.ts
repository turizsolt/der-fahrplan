import { TileModel } from '../Tiles/TileModel';
import { PassengerCarModel } from 'src/Engine/PassengerCarModel';
import { EngineModel } from 'src/Engine/EngineModel';

export class LandModel {
    public cars: PassengerCarModel[];
    public engines: EngineModel[];
    public platforms: TileModel[];
    public tracks: TileModel[];    
}
