import { BlockSegment } from "./BlockSegment";
import { BlockEnd } from "./BlockEnd";
import { DirectedBlock } from "./DirectedBlock";
import { Block } from "./Block";
import { PositionOnTrack } from "../Train/PositionOnTrack";
import { BlockJoint } from "./BlockJoint";
import { ActualDirectedBlock } from "./ActualDirectedBlock";
import { TrackDirection } from "../Track/TrackDirection";
import { ActualBlockEnd } from "./ActualBlockEnd";
import { WhichEnd } from "../../structs/Interfaces/WhichEnd";
import { BlockSegmentData } from "./BlockSegmentData";

export class ActualBlockSegment implements BlockSegment {
  protected A: BlockEnd;
  protected B: BlockEnd;
  protected AB: DirectedBlock;
  protected BA: DirectedBlock;
  protected block: Block;

  constructor(block: Block, segmentData: BlockSegmentData) {
    this.block = block;

    this.AB = new ActualDirectedBlock(this, TrackDirection.AB);
    this.BA = new ActualDirectedBlock(this, TrackDirection.BA);
    this.AB.setReverse(this.BA);
    this.BA.setReverse(this.AB);

    this.A = new ActualBlockEnd(this.AB, this.BA, segmentData.startJointEnd);
    this.B = new ActualBlockEnd(this.BA, this.AB, segmentData.endJointEnd);
  }

  remove(): void {
    this.disconnect();
  }

  getEnd(whichEnd: WhichEnd): BlockEnd {
    return this[whichEnd] ?? null;
  }

  getBlock(): Block {
    return this.block;
  }

  getDirected(direction: TrackDirection): DirectedBlock {
    return this[direction];
  }

  connect(): void {
    this.A.connect();
    this.B.connect();
  }

  disconnect(): void {
    this.A.disconnect();
    this.B.disconnect();
  }

  persist(): any {
    return {
        startJointEnd: this.A.persist(),
        endJointEnd: this.B.persist()
    };
  }
}
