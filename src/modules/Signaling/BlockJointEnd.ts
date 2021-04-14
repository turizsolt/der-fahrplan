import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BlockJoint } from './BlockJoint';

export interface BlockJointEnd {
  joint: BlockJoint;
  end: WhichEnd;
}
