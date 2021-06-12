import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { Store } from '../../structs/Interfaces/Store';
import { BlockJoint } from '../../modules/Signaling/BlockJoint';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BlockJointEnd } from '../../modules/Signaling/BlockJointEnd';
import { PathBlockEnd } from '../../modules/Signaling/PathBlockEnd';

export class CreatePathInputHandler implements InputHandler {
  private jointEnds: BlockJointEnd[] = [];

  constructor(private store: Store) {}

  down(props: InputProps, event: PointerEvent): void {}

  roam(props: InputProps, event: PointerEvent): void {}

  move(downProps: InputProps, props: InputProps, event: PointerEvent): void {}

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
        if (event.button === 2) {
          const pathBlocksEnds = this.jointEnds.map(
            je => je.joint.getEnd(je.end) as PathBlockEnd
          );
          const blockEnd = this.jointEnds[0].joint.getEnd(
            this.jointEnds[0].end
          );
          const pathBlockEnd = blockEnd as PathBlockEnd;
          const pathBlock = pathBlockEnd.getPathBlock();
          pathBlock.addRule({
            from: pathBlocksEnds[0],
            toOptions: pathBlocksEnds.slice(1)
          });
          this.jointEnds = [];
        }
      }
    }
  }

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {}

  cancel(): void {}
}
