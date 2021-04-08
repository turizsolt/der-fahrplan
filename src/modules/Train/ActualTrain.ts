import { ActualBaseStorable } from '../../structs/Actuals/ActualStorable';
import { TYPES } from '../../di/TYPES';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { Train } from './Train';
import { Store } from '../../structs/Interfaces/Store';
import { PositionOnTrack } from './PositionOnTrack';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';

export class ActualTrain extends ActualBaseStorable implements Train {
  private position: PositionOnTrack = null;
  private wagons: Wagon[] = [];

  init(pot: PositionOnTrack, wagons: Wagon[]): Train {
    super.initStore(TYPES.Train);

    this.position = pot;
    this.wagons = wagons;
    this.alignAxles();
    this.wagons.map(wagon => wagon.update());
    return this;
  }

  getPosition(): PositionOnTrack {
    return this.position;
  }

  getWagons(): Wagon[] {
    return this.wagons;
  }

  addWagons(wagons: Wagon[]): void {
    this.wagons.push(...wagons);
    this.alignAxles();
    this.wagons.map(wagon => wagon.update());
  }

  merge(otherTrain: Train): void {
    this.wagons.push(...otherTrain.getWagons());
    otherTrain.remove();
    this.alignAxles();
  }

  separate(wagon: Wagon, newTrainId?: string): Train {
    const newPot = wagon.getAxlePosition(WhichEnd.A);
    const preWagonPos = this.wagons.findIndex(x => x === wagon);
    const wagonPos = preWagonPos === -1 ? this.wagons.length : preWagonPos;
    const newWagons = this.wagons.slice(wagonPos);
    this.wagons = this.wagons.slice(0, wagonPos);
    const newTrain = this.store.create<Train>(TYPES.Train);
    newTrain.presetId(newTrainId);
    newTrain.init(newPot, newWagons);
    return newTrain;
  }

  reverse(): void {
    this.wagons = this.wagons.reverse();
    this.wagons.map(wagon => wagon.axleReverse());
    this.position = this.wagons[0].getAxlePosition(WhichEnd.A);
  }

  private alignAxles(): void {
    if (!this.position) return;

    const pos: PositionOnTrack = this.position.clone();
    pos.reverse();
    for (let wagon of this.wagons) {
      const pos1 = pos.clone();
      pos1.reverse();
      wagon.setAxlePosition(WhichEnd.A, pos1);
      pos.hop(14);
      const pos2 = pos.clone();
      pos2.reverse();
      wagon.setAxlePosition(WhichEnd.B, pos2);
      pos.hop(1);
    }
  }

  persist(): Object {
    return {};
  }

  load(obj: Object, store: Store): void {}
}
