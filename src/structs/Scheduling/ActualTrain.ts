import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Train } from './Train';
import { Wagon } from '../Interfaces/Wagon';

export class ActualTrain extends ActualBaseStorable implements Train {
  private wagons: Wagon[];

  init(first: Wagon): Train {
    super.initStore(TYPES.Train);
    this.wagons = [first];
    return this;
  }

  getWagons(): Wagon[] {
    return this.wagons;
  }

  private removed: boolean = false;
  remove(): void {
    this.store.unregister(this);
    this.removed = true;
  }

  isRemoved(): boolean {
    return this.removed;
  }

  mergeWith(other: Train): void {
    for (let wagon of other.getWagons()) {
      wagon.setTrain(this);
    }
    this.wagons = [...this.wagons, ...other.getWagons()];
    other.remove();
  }

  separateThese(wagons: Wagon[]): void {
    wagons[0].setTrain(undefined);
    const train = wagons[0].getTrain();
    for (let wagon of wagons) {
      this.wagons = this.wagons.filter(x => x !== wagon);
      wagon.setTrain(train);
    }
    train.setWagons(wagons);
  }

  setWagons(wagons: Wagon[]) {
    this.wagons = wagons;
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'Train'
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(undefined);
  }
}
