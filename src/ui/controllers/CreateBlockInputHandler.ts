import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { productionContainer } from '../../di/production.config';
import { TYPES } from '../../di/TYPES';
import { Store } from '../../structs/Interfaces/Store';
import { BlockJoint } from '../../modules/Signaling/BlockJoint';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BlockJointEnd } from '../../modules/Signaling/BlockJointEnd';
import { Block } from '../../modules/Signaling/Block';

export class CreateBlockInputHandler implements InputHandler {
  private store: Store;
  private jointEnds: BlockJointEnd[] = [];

  constructor() {
    this.store = productionContainer.get<() => Store>(TYPES.FactoryOfStore)();
  }

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
        if (this.jointEnds.length === 2) {
          this.store.create<Block>(TYPES.Block).init({
            startJointEnd: this.jointEnds[0],
            endJointEnd: this.jointEnds[1]
          });
          this.jointEnds = [];
        }
      }
    }
  }

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {}

  cancel(): void {}
}
