import { InputHandler } from './InputHandler';
import { keyUp, keyDown } from './Interfaces/Helpers';
import { Store } from '../../../structs/Interfaces/Store';
import { Wagon } from '../../../structs/Interfaces/Wagon';
import { CommandCreator } from '../../../structs/Actuals/Store/Command/CommandCreator';
import { BaseStorable } from '../../../structs/Interfaces/BaseStorable';
import { BaseBrick } from '../../../structs/Interfaces/BaseBrick';
import { Train } from '../../../modules/Train/Train';
import { GlobalController } from '../GlobalController';
import { RailMapCreator } from '../../../modules/RailMap/RailMapCreator';
import { TYPES } from '../../../di/TYPES';
import { Sensor } from '../../../modules/Signaling/Sensor';

export class GeneralInputHandler extends InputHandler {
  constructor(private store: Store, private globalController: GlobalController) {
    super();

    this.reg(keyDown('PageUp'), () => {
      const list = this.store.getAllOf<Train>(Symbol.for('Train'));
      const wagon = this.getSelected()?.getType() === Symbol.for('Wagon') ? (this.getSelected() as Wagon) : null;
      const pivot = wagon?.getTrain()?.getId();
      const index = pivot ? list.findIndex(x => x.getId() === pivot) : -1;
      const newIndex = (index + 1) % list.length;
      // todo this.select(list[newIndex].getWagons()[0]);    
    });

    this.reg(keyDown('PageDown'), () => {
      const list = this.store.getAllOf<Train>(Symbol.for('Train'));
      const wagon = this.getSelected()?.getType() === Symbol.for('Wagon') ? (this.getSelected() as Wagon) : null;
      const pivot = wagon?.getTrain()?.getId();
      const index = pivot ? list.findIndex(x => x.getId() === pivot) : -1;
      const newIndex = (index - 1) < 0 ? list.length + index - 1 : index - 1;
      // todo this.select(list[newIndex].getWagons()[0]);
    });

    this.reg(keyUp('K'), () => {
      const download = (content, fileName, contentType) => {
        var a = document.createElement('a');
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
      };

      const data = {
        data: this.store.persistAll(),
        ...globalController.saveSpecific(),
        _version: 2,
        _format: 'fahrplan'
      };

      const fileName = `${new Date().toISOString()}.${(Math.random() *
        90000) |
        (0 + 100000)}.fahrplan`;

      download(JSON.stringify(data), fileName, 'application/json');
    });

    this.reg(keyUp('O'), () => {
      console.log('correcting sensors');
      let n = 0;
      const sensors: Sensor[] = this.store.getAllOf<Sensor>(TYPES.Sensor);
      sensors.map(s => {
        const pos = s.getPosition();

        if (pos.getTrack().getType() === TYPES.Track) return;

        const newPos = pos.clone();
        newPos.move(1);

        s.setPosition(newPos);
        n++;
      });
      console.log(n, ' corrected');
    });

    this.reg(keyUp('D'), () => {
      if (!this.getSelected()) return false;
      (this.getSelected() as BaseBrick)
        .getRenderer()
        .process('lock');
    });

    this.reg(keyUp('I'), () => {

      if (!this.getSelected()) return false;
      if (this.getSelected().getType() !== TYPES.TrackSwitch) return false;

      this.store
        .getCommandLog()
        .addAction(
          CommandCreator.switchTrack(this.getSelected().getId())
        );
    });

  }

  private getSelected(): BaseStorable {
    return this.store.getSelected();
  }
}
