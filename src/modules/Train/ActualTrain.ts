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
import { Nearest } from './Nearest';
import { NearestData } from './NearestData';
import { WAGON_GAP } from '../../structs/Actuals/Wagon/WagonGap';
import { PositionData } from './PositionData';

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

    this.speed = new ActualTrainSpeed(() => this.canAccelerate());
    return this;
  }

  private canAccelerate(): boolean {
    return (
      (this.getWagons()[0].hasControl(WhichEnd.A) || this.getSpeed().isShunting()) &&
      !!this.getWagons().find(wagon => wagon.hasEngine())
    );
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
    otherTrain.getWagons().map(wagon => wagon.setTrain(this));
    otherTrain.removeAndKeepWagons();
    this.alignAxles();
    this.wagons.map(wagon => wagon.update());
  }

  separate(wagon: Wagon, newTrainId?: string): Train {
    const newPot = wagon.getAxlePosition(WhichEnd.A);
    const preWagonPos = this.wagons.findIndex(x => x === wagon);
    const wagonPos = preWagonPos === -1 ? this.wagons.length : preWagonPos;
    const newWagons = this.wagons.slice(wagonPos);
    this.wagons = this.wagons.slice(0, wagonPos);
    const newTrain = this.store.create<Train>(TYPES.Train);
    newTrain.presetId(newTrainId);
    newWagons.map(wagon => wagon.setTrain(newTrain));
    newTrain.init(newPot, newWagons);
    return newTrain;
  }

  reverse(): void {
    if(this.speed.getSpeed() !== 0) return;
    
    this.wagons = this.wagons.reverse();
    this.wagons.map(wagon => wagon.axleReverse());
    this.position = this.wagons[0].getAxlePosition(WhichEnd.A);
  }

  getEndPosition(): PositionOnTrack {
    return this.wagons[this.wagons.length - 1]
      .getAxlePosition(WhichEnd.B)
      ?.clone();
  }

  private setMarkers(): void {
    const start = this.position.getDirectedTrack();
    const end = this.getEndPosition().getDirectedTrack();
    start.addMarkerBothDirections(this.position.getPosition(), {type: 'Train', train: this});
    end.addMarkerBothDirections(this.getEndPosition().getPosition(), {type: 'Train', train: this});
  }

  private clearMarkers(): void {
    const start = this.position.getDirectedTrack();
    const end = this.getEndPosition().getDirectedTrack();
    start.removeMarkerBothDirections({type: 'Train', train: this});
    end.removeMarkerBothDirections({type: 'Train', train: this});
  }

  private alignAxles(): void {
    if (!this.position) return;

    // checkouts
    let iter = this.getEndPosition()?.getDirectedTrack();
    if(iter) {
      const start = this.position.getDirectedTrack();
      while (iter !== start) {
        iter.getTrack().checkout(this);
        iter = iter.next();
      }
      iter.getTrack().checkout(this);

      this.clearMarkers();
    }

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

    // checkins
    iter = this.getEndPosition().getDirectedTrack();
    const start2 = this.position.getDirectedTrack();
    while (iter !== start2) {
      iter.getTrack().checkin(this);
      iter = iter.next();
    }
    iter.getTrack().checkin(this);

    this.setMarkers();
  }

  remove(): void {
    this.wagons.map(wagon => wagon.remove());
    this.removeAndKeepWagons();
  }

  removeAndKeepWagons(): void {
    this.clearMarkers();
    this.store.unregister(this);
  }

  setPosition(position: PositionOnTrack): void {
    this.position = position.clone();
    this.alignAxles();
    this.wagons.map(wagon => wagon.update());
  }

  private lastSpeed: number = -1;

  private nearestEnd: NearestData = null;
  private nearestTrain: NearestData = null;

  getNearestEnd(): NearestData {
    return this.nearestEnd;
  }

  getNearestTrain(): NearestData {
    return this.nearestTrain;
  }

  tick(): void {
    this.speed.tick();
    if(this.speed.getSpeed() === 0 && this.lastSpeed === 0) {
      this.wagons.map(wagon => wagon.update());
    }
    this.lastSpeed = this.speed.getSpeed();

    if (this.speed.getSpeed() === 0) return;
    
    const nextPosition = this.position.clone();
    nextPosition.move(this.speed.getSpeed());

    this.nearestEnd = Nearest.end(nextPosition);
    this.nearestTrain = Nearest.train(nextPosition);

    if(this.nearestTrain.distance < WAGON_GAP) {
      const frontDist = this.nearestTrain.train.getPosition().getRay().coord.distance2d(this.position.getRay().coord);
      const rearDist = this.nearestTrain.train.getEndPosition().getRay().coord.distance2d(this.position.getRay().coord);
      if(frontDist < rearDist) {
        this.nearestTrain.train.reverse();
      }

      this.store.getCommandLog().addAction(CommandCreator.mergeTrain(
        this.nearestTrain.train.getId(),
        this.getId(),
        this.getWagons()[0].getId(),
      ));
    } else {
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
  }

  persist(): Object {
    return {
        id: this.id,
        type: 'Train',
        position: this.position?.persist(),
        speed: this.speed?.persist(),
        wagons: this.wagons.map(wagon => wagon.getId())
    };
  }

  persistDeep(): Object {
    return {
      id: this.id,
      type: 'Train',
      wagons: this.wagons.map(x => ({
        id: x.getId(),
        appearanceId: x.getAppearanceId(),
        tripId: x.getTrip()?.getId(),
        tripNo: 1, // todo trip, this.trips.findIndex(y => x.trip === y) + 1,
        trip: x.getTrip()?.persistDeep(),
        side: WhichEnd.A,
      })),
      trips: [] // todo trip, this.trips.map(t => t.persistDeep())
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(
      PositionOnTrack.fromData(obj.position as PositionData, store), 
      obj.wagons.map(id => store.get(id) as Wagon)
    );
    this.speed.load(obj.speed);
    this.wagons.map(wagon => {
        wagon.setTrain(this);
        wagon.update();
    });
  }
}
