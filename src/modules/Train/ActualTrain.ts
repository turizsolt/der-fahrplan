import { ActualBaseStorable } from '../../structs/Actuals/ActualStorable';
import { TYPES } from '../../di/TYPES';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { Train } from './Train';
import { Store } from '../../structs/Interfaces/Store';
import { PositionOnTrack } from './PositionOnTrack';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { CommandCreator } from '../../structs/Actuals/Store/Command/CommandCreator';
import { TrainSpeed } from './TrainSpeed';
import { ActualTrainSpeed } from './ActualTrainSpeed';

export class ActualTrain extends ActualBaseStorable implements Train {
  private position: PositionOnTrack = null;
  private wagons: Wagon[] = [];
  private speed: TrainSpeed = null;

  init(pot: PositionOnTrack, wagons: Wagon[]): Train {
    super.initStore(TYPES.Train);

    this.position = pot;
    this.wagons = wagons;
    this.alignAxles();
    this.wagons.map(wagon => wagon.update());

    this.speed = new ActualTrainSpeed();
    return this;
  }

  getSpeed(): TrainSpeed {
    return this.speed;
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

  remove(): void {
    this.wagons.map(wagon => wagon.remove());
    this.store.unregister(this);
  }

  setPosition(position: PositionOnTrack): void {
    this.position = position.clone();
    this.alignAxles();
    this.wagons.map(wagon => wagon.update());
  }

  private lastSpeed: number = -1;

  tick(): void {
    this.speed.tick();
    if (this.speed.getSpeed() === 0 && this.lastSpeed === 0) return;
    this.lastSpeed = this.speed.getSpeed();

    const nextPosition = this.position.clone();
    nextPosition.move(this.speed.getSpeed());
    this.store
      .getCommandLog()
      .addAction(
        CommandCreator.moveTrain(
          this.id,
          this.position.persist(),
          nextPosition.persist()
        )
      );
  }

  persist(): Object {
    return {};
  }

  load(obj: Object, store: Store): void {}
}
