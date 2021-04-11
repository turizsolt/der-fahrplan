import { RayData } from '../../structs/Geometry/RayData';

export interface WagonData {
  id: string;
  appearanceId: string;
  ray: RayData;
  rayA: RayData;
  rayB: RayData;
  isTrainSelected: boolean;
  isFirst: boolean;
}
