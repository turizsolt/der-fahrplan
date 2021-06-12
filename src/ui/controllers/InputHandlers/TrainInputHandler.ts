import { NewInputHandler } from './NewInputHandler';
import { keyUp, keyDown } from './Interfaces/Helpers';
import { Store } from '../../../structs/Interfaces/Store';
import { TYPES } from '../../../di/TYPES';
import { Wagon } from '../../../structs/Interfaces/Wagon';
import { CommandCreator } from '../../../structs/Actuals/Store/Command/CommandCreator';
import { SpeedPedal } from '../../../modules/Train/SpeedPedal';
import { BaseStorable } from '../../../structs/Interfaces/BaseStorable';
import { BaseBrick } from '../../../structs/Interfaces/BaseBrick';

export class TrainInputHandler extends NewInputHandler {
  constructor(private store: Store) {
    super();

    this.reg(keyDown('ArrowUp'), () => {
      if (!this.getSelected()) return false;
      if (this.getSelected().getType() === TYPES.Wagon) {
        const train = (this.getSelected() as Wagon).getTrain();
        this.store
          .getCommandLog()
          .addAction(
            CommandCreator.pedalTrain(
              train.getId(),
              train.getSpeed().getPedal(),
              SpeedPedal.Throttle
            )
          );
      }
    });

    this.reg(keyDown('ArrowDown'), () => {
      if (!this.getSelected()) return false;
      if (this.getSelected().getType() === TYPES.Wagon) {
        const train = (this.getSelected() as Wagon).getTrain();
        this.store
          .getCommandLog()
          .addAction(
            CommandCreator.pedalTrain(
              train.getId(),
              train.getSpeed().getPedal(),
              SpeedPedal.Brake
            )
          );
      }
    });

    const changeDirection = (() => {
      if (!this.getSelected()) return false;
      if (this.getSelected().getType() === TYPES.Wagon) {
        const wagon = this.getSelected() as Wagon;
        this.store
          .getCommandLog()
          .addAction(CommandCreator.reverseTrain(wagon.getTrain().getId()));
      }
    }).bind(this);

    this.reg(keyUp('ArrowLeft'), changeDirection);
    this.reg(keyUp('ArrowRight'), changeDirection);

    const speedPedalToNeutral = (() => {
      if (!this.getSelected()) return false;
      if (this.getSelected().getType() === TYPES.Wagon) {
        const train = (this.getSelected() as Wagon).getTrain();
        this.store
          .getCommandLog()
          .addAction(
            CommandCreator.pedalTrain(
              train.getId(),
              train.getSpeed().getPedal(),
              SpeedPedal.Neutral
            )
          );
      }
    }).bind(this);

    this.reg(keyUp('ArrowUp'), speedPedalToNeutral);
    this.reg(keyUp('ArrowDown'), speedPedalToNeutral);

    this.reg(keyUp('Z'), () => {
      if (!this.getSelected()) return false;
      if (this.getSelected().getType() === TYPES.Wagon) {
        const wagon = this.getSelected() as Wagon;
        this.store
          .getCommandLog()
          .addAction(CommandCreator.reverseWagonFacing(wagon.getId()));
      }
    });

    this.reg(keyUp('M'), () => {
      if (!this.getSelected()) return false;
      if (this.getSelected().getType() === TYPES.Wagon) {
        const wagon = this.getSelected() as Wagon;
        const isShunting = wagon
          .getTrain()
          .getSpeed()
          .isShunting();
        this.store
          .getCommandLog()
          .addAction(
            isShunting
              ? CommandCreator.unshuntingTrain(wagon.getTrain().getId())
              : CommandCreator.shuntingTrain(wagon.getTrain().getId())
          );
        wagon
          .getTrain()
          .getWagons()
          .map(wagon => wagon.update());
      }
    });

    this.reg(keyUp('A'), () => {
      if (!this.getSelected()) return false;
      if (this.getSelected().getType() === TYPES.Wagon) {
        const wagon = this.getSelected() as Wagon;
        wagon.getTrain().setAutoMode(!wagon.getTrain().getAutoMode());
      }
    });

    this.reg(keyUp('Enter'), () => {
      if (!this.getSelected()) return false;
      if (this.getSelected().getType() === TYPES.Wagon) {
        (this.getSelected() as Wagon).stop();
      }
    });
  }

  private getSelected(): BaseStorable {
    return this.store.getSelected();
  }
}
