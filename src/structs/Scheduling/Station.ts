import { BaseBrick } from '../Interfaces/BaseBrick';
import { Circle } from '../Geometry/Circle';
import { Platform } from '../Interfaces/Platform';

export interface Station extends BaseBrick {
  init(circle: Circle): Station;
  getName(): string;
  setName(name: string);
  getPlatforms(): Platform[];
  getCircle(): Circle;
}
