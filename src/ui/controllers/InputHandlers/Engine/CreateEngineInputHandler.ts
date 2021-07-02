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

    this.reg(click(), (legacyProps: InputProps) => {
      const dpot = legacyProps.snappedPositionOnTrack;

      if (dpot && dpot.track.constructor.name === ActualTrack.name) {
        this.store.getCommandLog().addAction(
          CommandCreator.createTrain(
            GENERATE_ID,
            GENERATE_ID,
            getPredefinedWagonConfig('wagon'), // todo legacyProps.wagonType),
            (dpot.track as Track).getId(),
            dpot.position,
            1
          )
        );
      }

      this.plugin.click();
    });

    this.reg(roam(), (legacyProps: InputProps) => {
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
}
