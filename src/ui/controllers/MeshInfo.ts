import { BaseBrick } from '../../structs/Interfaces/BaseBrick';

export interface MeshInfo {
  type: symbol;
  typeString: string;
  id: string;
  command: string;
  storedBrick: BaseBrick;
}
