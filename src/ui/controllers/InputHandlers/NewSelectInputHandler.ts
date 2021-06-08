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
import { MeshInfo } from '../MeshInfo';
import { BaseBrick } from '../../../structs/Interfaces/BaseBrick';
import { BaseStorable } from '../../../structs/Interfaces/BaseStorable';
import { VueSidebar } from '../VueSidebar';
import { InputProps } from '../InputProps';

export class NewSelectInputHandler extends NewInputHander {
  constructor(private store: Store, private vueSidebar: VueSidebar) {
    super();

    this.reg(keyUp('Q'), () => {
      console.log('Q');
    });

    this.reg(click(MouseLeft), (legacyProp: InputProps) => {
      console.log('clicked');
    
      const meshInfo = this.getMeshInfo(legacyProp?.mesh?.id);
      console.log('meshInfo', meshInfo);
      if(!meshInfo || !meshInfo.storedBrick) return false;

      const {storedBrick} = meshInfo;
      let selected: BaseStorable = this.store.getSelected();

      if(selected) {
        this.deselect(selected);
      }

      if (storedBrick !== selected) {  
        this.select(storedBrick);
      }
    
      return true;  
    });

    this.reg(click(MouseRight), (legacyProp: InputProps) => {
      console.log('right clicked');

      const meshInfo = this.getMeshInfo(legacyProp?.mesh?.id);
      if(!meshInfo || !meshInfo.storedBrick) return false;

      const {command, storedBrick} = meshInfo;

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

  // SELECT

  private selectCallback: (ob: Object) => void = null;
  
  private getMeshInfo(meshId: string): MeshInfo {
    if(!meshId) return null;

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

  // TODO - should work for all, not just wagons...
  private setCallbackOff(selected: BaseStorable) {
    if (
        this.selectCallback && 
        selected &&
        selected.getType() === TYPES.Wagon
      ) {
        (selected as Wagon).off('info', this.selectCallback);
      }
  }

  // TODO - should work for all, not just wagons...
  private setCallbackOn(selected: BaseStorable) {
    if (selected && selected.getType() === Symbol.for('Wagon')) {
      this.selectCallback = (obj: Object): void => {
        this.vueSidebar.setData('selected', obj);
      };
      (selected as Wagon).on('info', this.selectCallback);
    }
  }

  convertSymbolToType(type: Symbol): string {
    if(type === Symbol.for('Passenger')) return 'passenger';
    if(type === Symbol.for('Wagon')) return 'wagon';
    if(type === Symbol.for('Station')) return 'station';
    return 'idtext';
  }

  deselect(selected: BaseStorable) {
    this.setCallbackOff(selected)
    selected.deselect();

    // todo - emit instead
    this.vueSidebar.setData('selected', null);
    this.vueSidebar.setData('type', null);
  }

  select(selectable: BaseStorable) {
    this.setCallbackOff(this.store.getSelected());
    selectable.select();
    this.setCallbackOn(this.store.getSelected());

    // todo - emiting
    this.vueSidebar.setData('selected', Object.freeze(selectable.persistDeep()));
    this.vueSidebar.setData('type',this.convertSymbolToType(selectable.getType()));
  }
}
