import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { TYPES } from '../../di/TYPES';
import { Store } from '../../structs/Interfaces/Store';
import { BlockJoint } from '../../modules/Signaling/BlockJoint';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BlockJointEnd } from '../../modules/Signaling/BlockJointEnd';
import { Signal } from '../../modules/Signaling/Signal';
import { SignalSignal } from '../../modules/Signaling/SignalSignal';
import { Section } from '../../modules/Signaling/Section';

export class CreateSectionInputHandler implements InputHandler {
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
          if (this.jointEnds.length === 2) {
            const section = this.store
              .create<Section>(TYPES.Section)
              .init(this.jointEnds[0], this.jointEnds[1]);
            section.connect();

            createSignals(this.jointEnds, SignalSignal.Green, this.store);
          }
          this.jointEnds = [];
        }
      }
    }
  }

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {}

  cancel(): void {}
}

export function createSignals(jointEnds: BlockJointEnd[], startSignal: SignalSignal, store: Store) {
    jointEnds.map(x => {
      const position = x.joint.getPosition().clone();
      if (x.end === WhichEnd.B) {
        position.reverse();
      }

      const dt = position.getDirectedTrack();
      const pos = position.getPosition();
      const signal:Signal = dt
        .getMarkers()
        .find(m => m.marker.type === 'Signal' && m.position === pos)?.marker.signal;

      const sectionEnd = x.joint.getSectionEnd(x.end);
      const blockEnd = x.joint.getEnd(x.end);

      if (signal) {
        if(sectionEnd) {
          signal.addSectionEmitter(sectionEnd);
        }
        if(blockEnd) {
          signal.addBlockEmitter(blockEnd);
        }
      } else {
        store
          .create<Signal>(TYPES.Signal)
          .init(position, blockEnd, sectionEnd, startSignal);
      }
    });
  }