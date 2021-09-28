import { BlockEnd } from './BlockEnd';
import { PathBlock } from './PathBlock';

export interface PathBlockEnd extends BlockEnd {
  setBlockEnd(blockEnd: BlockEnd): void;
  getPathBlock(): PathBlock;
  pathConnect(): void;
  pathDisconnect(): void;
  setGreen(): void;
}
