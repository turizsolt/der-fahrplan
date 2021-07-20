import { InputHandler } from '../InputHandler';
import { click } from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { InputProps } from '../../InputProps';
import { CommandLog } from '../../../../structs/Actuals/Store/Command/CommandLog';
import { CapacityCapInputHandlerPlugin } from './CapacityCapInputHandlerPlugin';
import { CapacityCapInputHandlerPixi } from './CapacityCapInputHandlerPixi';
import { CapacityCapInputHandlerBabylon } from './CapacityCapInputHandlerBabylon';
import { MeshInfo } from '../../MeshInfo';
import { BaseBrick } from '../../../../structs/Interfaces/BaseBrick';
import { TYPES } from '../../../../di/TYPES';
import { BlockJoint } from '../../../../modules/Signaling/BlockJoint';
import { WhichEnd } from '../../../../structs/Interfaces/WhichEnd';
import { MouseLeft } from '../Interfaces/InputType';
import { CapacityCap } from '../../../../modules/Signaling/CapacityCap/CapacityCap';
import { Signal } from '../../../../modules/Signaling/Signal';
import { BlockJointEnd } from '../../../../modules/Signaling/BlockJointEnd';
import { SignalSignal } from '../../../../modules/Signaling/SignalSignal';

// @injectable()
export class CapacityCapInputHandler extends InputHandler {
  private commandLog: CommandLog;

  // @inject(TYPES.TrackInputHandler)
  private plugin: CapacityCapInputHandlerPlugin;

  constructor(private store: Store) {
    super();

    // todo inject
    this.plugin =
      globalThis.startParam === '2d'
        ? new CapacityCapInputHandlerPixi()
        : new CapacityCapInputHandlerBabylon();
    this.plugin.init();
    this.commandLog = store.getCommandLog();

    this.reg(click(MouseLeft), (legacyEvent: PointerEvent) => {
      const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
      const meshInfo = this.getMeshInfo(legacyProps?.mesh?.id);
      if (!meshInfo || !meshInfo.storedBrick) return false;
      if (meshInfo.type !== TYPES.BlockJoint) return false;

      const joint = this.store.get(meshInfo.id) as BlockJoint;
      const end = meshInfo.command === 'jointA' ? WhichEnd.A : WhichEnd.B;

      const ccap = store.create<CapacityCap>(TYPES.CapacityCap).init([{ joint, end }]);
      // todo remove joint.setOneCapacityCap(end, ccap);

      createSignals({ joint, end }, SignalSignal.Green, this.store, ccap);
    });
  }

  // todo duplicate from SelectInputHandler
  private getMeshInfo(meshId: string): MeshInfo {
    if (!meshId) return null;

    if (meshId.includes('.')) {
      meshId = meshId.slice(0, meshId.indexOf('.'));
    }

    if (meshId.startsWith('clickable-')) {
      const [_, type, id, command] = meshId.split('-');
      const storedObj = this.store.get(id);
      const storedBrick = storedObj as BaseBrick;
      return {
        typeString: type, id, command, storedBrick, type: storedBrick?.getType()
      };
    }

    return null;
  }
}

// todo similar to BlockWizard's create signal
function createSignals(jointEnd: BlockJointEnd, startSignal: SignalSignal, store: Store, capacityCap: CapacityCap) {
  const position = jointEnd.joint.getPosition().clone();
  if (jointEnd.end === WhichEnd.A) {
    position.reverse();
  }

  const dt = position.getDirectedTrack();
  const pos = position.getPosition();
  const signal: Signal = dt
    .getMarkers()
    .find(m => m.marker.type === 'Signal' && m.position === pos)?.marker.signal;

  if (signal) {
    if (capacityCap) {
      signal.addCapacityEmitter(capacityCap);
    }
  } else {
    store
      .create<Signal>(TYPES.Signal)
      .init(position, null, null, startSignal, capacityCap);
  }
}
