import { ActualBaseStorable } from '../../structs/Actuals/ActualStorable';
import { TYPES } from '../../di/TYPES';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { Train2 } from './Train2';
import { Store } from '../../structs/Interfaces/Store';
import { PositionOnTrack2 } from './PositionOnTrack2';
import { TrackDirection } from '../Track/TrackDirection';

export class ActualTrain2 extends ActualBaseStorable implements Train2 {
  private position: PositionOnTrack2 = null;
  private wagons: Wagon[] = [];

  init(pot: PositionOnTrack2, wagons: Wagon[]): Train2 {
    // super.initStore(TYPES.Train);

    this.position = pot;
    this.wagons = wagons;
    return this;
  }

  getPosition(): PositionOnTrack2 {
    return this.position;
  }

  getWagons(): Wagon[] {
    return this.wagons;
  }

  addWagons(wagons: Wagon[]): void {
    this.wagons.push(...wagons);
  }

  merge(otherTrain: Train2): void {
    this.wagons.push(...otherTrain.getWagons());
    otherTrain.remove();
  }

  separate(wagon: Wagon, newTrainId?: string): Train2 {
    // todo need to hassle to convert PoT to PoT2
    const oldPot = wagon.getA().getPositionOnTrack();
    const newPot = new PositionOnTrack2(
      oldPot.getTrack(),
      oldPot.getPercentage() * oldPot.getTrack().getLength(),
      oldPot.getDirection() === 1 ? TrackDirection.AB : TrackDirection.BA
    );

    const preWagonPos = this.wagons.findIndex(x => x === wagon);
    const wagonPos = preWagonPos === -1 ? this.wagons.length : preWagonPos;
    const newWagons = this.wagons.slice(wagonPos);
    this.wagons = this.wagons.slice(0, wagonPos);
    const newTrain = new ActualTrain2();
    newTrain.presetId(newTrainId);
    newTrain.init(newPot, newWagons);
    return newTrain;
  }

  reverse(): void {
    this.wagons = this.wagons.reverse();
  }

  persist(): Object {
    throw new Error('Method not implemented.');
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
