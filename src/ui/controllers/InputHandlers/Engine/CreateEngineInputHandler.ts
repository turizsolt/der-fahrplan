import { InputHandler } from '../InputHandler';
import { roam, click } from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { CreateEngineInputHandlerPlugin } from './CreateEngineInputHandlerPlugin';
import { CreateEngineInputHandlerPixi } from './CreateEngineInputHandlerPixi';
import { CreateEngineInputHandlerBabylon } from './CreateEngineInputHandlerBabylon';
import { ActualTrack } from '../../../../modules/Track/ActualTrack';
import { CommandCreator } from '../../../../structs/Actuals/Store/Command/CommandCreator';
import { GENERATE_ID } from '../../../../structs/Actuals/Store/Command/CommandLog';
import { getPredefinedWagonConfig } from '../../../../structs/Actuals/Wagon/ActualWagonConfigs';
import { Track } from '../../../../modules/Track/Track';
import { InputProps } from '../../InputProps';
import { BaseBrick } from '../../../../structs/Interfaces/BaseBrick';
import { MeshInfo } from '../../MeshInfo';
import { TYPES } from '../../../../di/TYPES';
import { Wagon } from '../../../../structs/Interfaces/Wagon';

export class CreateEngineInputHandler extends InputHandler {
  private plugin: CreateEngineInputHandlerPlugin;

  constructor(private store: Store) {
    super();

    // todo inject
    this.plugin =
      globalThis.startParam === '2d'
        ? new CreateEngineInputHandlerPixi()
        : new CreateEngineInputHandlerBabylon();
    this.plugin.init();

    this.reg(click(), (legacyEvent: PointerEvent) => {
      const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
      const dpot = legacyProps.snappedPositionOnTrack;

      const meshInfo = this.getMeshInfo(legacyProps?.mesh?.id);
      if (meshInfo?.storedBrick?.getType() === TYPES.Wagon) {
        const wagon = meshInfo?.storedBrick as Wagon;
        // todo commandise
        wagon.getTrain().createWagonAtEnd(getPredefinedWagonConfig('mot'));

      } else if (dpot && dpot.track.constructor.name === ActualTrack.name) {
        this.store.getCommandLog().addAction(
          CommandCreator.createTrain(
            GENERATE_ID,
            GENERATE_ID,
            getPredefinedWagonConfig('mot'), // todo legacyProps.wagonType),
            (dpot.track as Track).getId(),
            dpot.position,
            1
          )
        );
      }

      this.plugin.click();
    });

    this.reg(roam(), (legacyEvent: PointerEvent) => {
      const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
      const pot = legacyProps.snappedPositionOnTrack;
      if (pot && pot.track.constructor.name === ActualTrack.name) {
        const point = pot.track
          .getCurve()
          .getBezier()
          .getPoint(pot.position);

        this.plugin.roam(!!pot, point);
      } else {
        this.plugin.roam(false);
      }
    });
  }

  // todo cancel(): void {
  //   this.plugin.cancel();
  // }

  // todo reduce duplications of this
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
