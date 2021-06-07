import { NewInputHander } from './NewInputHandler';
import { MouseLeft, MouseRight } from './Interfaces/InputType';
import { keyUp, click } from './Interfaces/Helpers';
import { GENERATE_ID } from '../../../structs/Actuals/Store/Command/CommandLog';
import { CommandCreator } from '../../../structs/Actuals/Store/Command/CommandCreator';
import { TYPES } from '../../../di/TYPES';
import { Signal } from '../../../modules/Signaling/Signal';
import { SignalSignal } from '../../../modules/Signaling/SignalSignal';
import { Store } from '../../../structs/Interfaces/Store';
import { Wagon } from '../../../structs/Interfaces/Wagon';

export class NewSelectInputHandler extends NewInputHander {
  constructor(private store: Store) {
    super();

    this.reg(keyUp('Q'), () => {
      console.log('Q');
    });

    this.reg(click(MouseLeft), () => {
      console.log('clicked');
    });

    this.reg(click(MouseRight), () => {
      console.log('right clicked');
      // todo - get real command and storeBrick values
      const command = 'alma' + Math.random();
      const storedBrick: any = {};

      // unmerging train
      if (command && command === 'endA') {
        const wagon = storedBrick as Wagon;
        this.store
          .getCommandLog()
          .addAction(
            CommandCreator.unmergeTrain(
              wagon.getTrain().getId(),
              GENERATE_ID,
              wagon.getId()
            )
          );
        return true;
      }

      // switching switch
      if (storedBrick.getType() === TYPES.TrackSwitch) {
        this.store
          .getCommandLog()
          .addAction(CommandCreator.switchTrack(storedBrick.getId()));
        return true;
      }

      // switching signal
      if (storedBrick.getType() === TYPES.Signal) {
        const signal = storedBrick as Signal;
        signal.setBlockSignal(
          signal.getSignal() === SignalSignal.Red
            ? SignalSignal.Green
            : SignalSignal.Red
        );
        return true;
      }

      return false;
    });
  }
}
