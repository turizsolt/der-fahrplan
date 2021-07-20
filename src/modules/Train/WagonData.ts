import { RayData } from '../../structs/Geometry/RayData';
import { TrackDirection } from '../Track/TrackDirection';

export interface WagonData {
  id: string;
  appearanceId: string;
  appearanceFacing: TrackDirection;
  ray: RayData;
  rayA: RayData;
  rayB: RayData;
  isTrainSelected: boolean;
  isFirst: boolean;
  isShunting: boolean;
}
