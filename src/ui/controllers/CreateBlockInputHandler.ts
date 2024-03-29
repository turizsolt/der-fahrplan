import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { TYPES } from '../../di/TYPES';
import { Store } from '../../structs/Interfaces/Store';
import { BlockJoint } from '../../modules/Signaling/BlockJoint';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BlockJointEnd } from '../../modules/Signaling/BlockJointEnd';
import { Block } from '../../modules/Signaling/Block';
import { PathBlock } from '../../modules/Signaling/PathBlock';
import { SignalSignal } from '../../modules/Signaling/SignalSignal';
import { Sensor } from '../../modules/Signaling/Sensor';
import { createSignals } from './CreateSectionInputHandler';

export class CreateBlockInputHandler implements InputHandler {
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
        if (event.button === 2) {
          if (this.jointEnds.length === 2) {
            const block = this.store.create<Block>(TYPES.Block).init({
              startJointEnd: this.jointEnds[0],
              endJointEnd: this.jointEnds[1]
            });
            block.getSegment().connect();
            createSignals(this.jointEnds, SignalSignal.Green, this.store);
          } else if (this.jointEnds.length > 2) {
            const pb = this.store
              .create<PathBlock>(TYPES.PathBlock)
              .init(this.jointEnds);

            pb.getPathBlockEnds().map(pbe => pbe.pathConnect());
            pb.getPathBlockEnds().map(pbe => {
              const bj = pbe.getJointEnd().joint;
              const pot = bj.getPosition().clone();
              if (pbe.getJointEnd().end === WhichEnd.A) {
                pot.reverse();
              }
              pot.move(160);
              pot.reverse();

              this.store.create<Sensor>(TYPES.Sensor).init(pot, pb, pbe);
            });

            createSignals(this.jointEnds, SignalSignal.Red, this.store);
          }
          this.jointEnds = [];
        }
      }
    }
  }

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void { }

  cancel(): void { }
}
