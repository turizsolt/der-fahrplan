import { DirectedBlock } from './DirectedBlock';
import { BlockJointEnd } from './BlockJointEnd';
import { Block } from './Block';

export interface BlockEnd {
  getStart(): DirectedBlock;
  getEnd(): DirectedBlock;
  getJointEnd(): BlockJointEnd;
  getBlock(): Block;
  connect(): void;
  disconnect(): void;
  persist(): any;
  getType(): Symbol;
}
