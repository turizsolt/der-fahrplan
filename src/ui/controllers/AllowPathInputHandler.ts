import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { TYPES } from '../../di/TYPES';
import { Store } from '../../structs/Interfaces/Store';
import { BlockJoint } from '../../modules/Signaling/BlockJoint';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BlockJointEnd } from '../../modules/Signaling/BlockJointEnd';
import { PathBlockEnd } from '../../modules/Signaling/PathBlockEnd';

export class AllowPathInputHandler implements InputHandler {
  private jointEnds: BlockJointEnd[] = [];

  constructor(private store: Store) { }

  down(props: InputProps, event: PointerEvent): void { }

  roam(props: InputProps, event: PointerEvent): void { }

  move(downProps: InputProps, props: InputProps, event: PointerEvent): void { }

  click(downProps: InputProps, event: PointerEvent): void {
    let meshId = downProps.mesh.id;
    if (meshId.includes('.')) {
      meshId = meshId.slice(0, meshId.indexOf('.'));
    }
    if (meshId.startsWith('clickable-')) {
      const [_, type, id, command] = meshId.split('-');

      if (type === 'blockjoint') {
        const joint: BlockJoint = this.store.get(id) as BlockJoint;
        const end: WhichEnd = command === 'jointA' ? WhichEnd.A : WhichEnd.B;

        this.jointEnds.push({ joint, end });
        if (this.jointEnds.length === 2) {
          const blockEnd0 = this.jointEnds[0].joint.getEnd(
            this.jointEnds[0].end
          );
          const blockEnd1 = this.jointEnds[1].joint.getEnd(
            this.jointEnds[1].end
          );

          if (
            blockEnd0?.getType() === TYPES.PathBlockEnd &&
            blockEnd1?.getType() === TYPES.PathBlockEnd
          ) {
            if (
              (blockEnd0 as PathBlockEnd).getPathBlock() ===
              (blockEnd1 as PathBlockEnd).getPathBlock()
            ) {
              (blockEnd1 as PathBlockEnd).getPathBlock().allow(blockEnd0 as PathBlockEnd, blockEnd1 as PathBlockEnd, null, null);
            }
          }

          this.jointEnds = [];
        }
      }
    }
  }

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void { }

  cancel(): void { }
}
