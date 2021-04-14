import { DirectedBlock } from './DirectedBlock';
import { BlockJointEnd } from './BlockJointEnd';

export interface BlockEnd {
  getStart(): DirectedBlock;
  getEnd(): DirectedBlock;
  getJointEnd(): BlockJointEnd;
  connect(): void;
  disconnect(): void;
  persist(): any;
}
