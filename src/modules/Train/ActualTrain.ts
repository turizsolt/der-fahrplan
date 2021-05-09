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
import { SignalSignal } from '../Signaling/SignalSignal';
import { SpeedPedal } from './SpeedPedal';
import { Util } from '../../structs/Util';
import { MarkerIterator } from './MarkerIterator';
import { TrackMarker } from '../Track/TrackMarker';
import { DirectedTrack } from '../Track/DirectedTrack';
import { TrackDirection } from '../Track/TrackDirection';
import { SectionEnd } from '../Signaling/SectionEnd';
import { BlockEnd } from '../Signaling/BlockEnd';
import { Trip } from '../../structs/Scheduling/Trip';

export class ActualTrain extends ActualBaseStorable implements Train {
  private position: PositionOnTrack = null;
  private wagons: Wagon[] = [];
  private speed: TrainSpeed = null;
  private autoMode:boolean = true;
  private trips: Trip[] = [];

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

    const formerStart = Util.first(this.wagons).getAxlePosition(WhichEnd.A);
    const formerEnd = Util.last(this.wagons).getAxlePosition(WhichEnd.B);

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

    // todo remove the lot of clonings

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

    const currentStart = Util.first(this.wagons).getAxlePosition(WhichEnd.A);
    const currentEnd = Util.last(this.wagons).getAxlePosition(WhichEnd.B);

    // block checkout

    if(formerEnd) {
      const iter = MarkerIterator.fromPositionOnTrack(formerEnd, currentEnd);
      let next: {value: TrackMarker, directedTrack: DirectedTrack} = iter.nextOfFull('BlockJoint');
      while(next && next.value) {
        const bjend:BlockEnd = next.value.blockJoint.getEnd(convert2(next.directedTrack.getDirection()));
        const send:SectionEnd = next.value.blockJoint.getSectionEnd(convert2(next.directedTrack.getDirection()));
        if(bjend) {
          bjend.checkout(this);
        }
        if(send) {
          send.checkout(this);
        }
        next = iter.nextOfFull('BlockJoint');
      }
    }
    
    // block checkin
    if(formerStart) {
      const iter = MarkerIterator.fromPositionOnTrack(formerStart, currentStart);
      let next: {value: TrackMarker, directedTrack: DirectedTrack} = iter.nextOfFull('BlockJoint');
      while(next && next.value) {
        const bjend:BlockEnd = next.value.blockJoint.getEnd(convert(next.directedTrack.getDirection()));
        const send:SectionEnd = next.value.blockJoint.getSectionEnd(convert(next.directedTrack.getDirection()));
        if(bjend) {
          bjend.checkin(this);
        }
        if(send) {
          send.checkin(this);
        }
        next = iter.nextOfFull('BlockJoint');
      }
    }

    // sensor checkin
    if(formerStart) {
        const iter = MarkerIterator.fromPositionOnTrack(formerStart, currentStart);
        let next: {value: TrackMarker, directedTrack: DirectedTrack} = iter.nextOfFull('Sensor');
        while(next && next.value) {
          const sensor = next.value.sensor;
          sensor.checkin(this);
          next = iter.nextOfFull('Sensor');
        }
    }
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

  setAutoMode(autoMode: boolean): void {
    this.autoMode = autoMode;
  }

  getAutoMode(): boolean {
      return this.autoMode;
  }

  private lastSpeed: number = -1;

  private nearestEnd: NearestData = null;
  private nearestTrain: NearestData = null;
  private nearestSignal: NearestData = null;

  getNearestEnd(): NearestData {
    return this.nearestEnd;
  }

  getNearestTrain(): NearestData {
    return this.nearestTrain;
  }

  getNearestSignal(): NearestData {
    return this.nearestSignal;
  }

  assignTrip(trip: Trip, wagons?: Wagon[]): void {
    let addedCount = 0;
    for (let i = 0; i < this.wagons.length; i++) {
      if (
        (!wagons || wagons.includes(this.wagons[i])) &&
        (this.wagons[i].getPassengerCount())
      ) {
        addedCount++;
        this.wagons[i].setTrip(trip);
      }
    }

    if (addedCount && trip && !this.trips.includes(trip)) {
      this.trips.push(trip);
    }

    if (!trip) {
      this.updateTrips();
    }
  }

  private updateTrips(): void {
    this.trips = this.trips.filter(t => this.wagons.findIndex(w => w.getTrip() === t) > -1);
  }

  getTrips(): Trip[] {
    return this.trips;
  }

  removeTrip(trip: Trip): void {
    this.trips = this.trips.filter(t => t != trip);
    for (let i = 0; i < this.wagons.length; i++) {
      if (this.wagons[i].getTrip() === trip) {
        this.wagons[i].setTrip(undefined);
      }
    }
  }

  tick(): void {
    const nextPosition = this.position.clone();
    
    this.nearestEnd = Nearest.end(nextPosition);
    this.nearestTrain = Nearest.train(nextPosition);
    this.nearestSignal = Nearest.signal(nextPosition);

    if(this.autoMode && this.nearestSignal.signal) {
        if(this.nearestSignal.signal.getSignal() === SignalSignal.Red &&
        (this.speed.getStoppingDistance() + 5) >= this.nearestSignal.distance) {
            this.speed.setPedal(SpeedPedal.Brake);
        } else {
        // if(this.nearestSignal.signal.getSignal() === SignalSignal.Green) {
            this.speed.setPedal(SpeedPedal.Throttle);
        }
    }

    this.speed.tick();
    if(this.speed.getSpeed() === 0 && this.lastSpeed === 0) {
      this.wagons.map(wagon => wagon.update());
    }
    this.lastSpeed = this.speed.getSpeed();

    if (this.speed.getSpeed() === 0) return;
    
    

    nextPosition.move(this.speed.getSpeed());

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
      autoMode: this.getAutoMode(),
      wagons: this.wagons.map(x => ({
        id: x.getId(),
        appearanceId: x.getAppearanceId(),
        tripId: x.getTrip()?.getId(),
        tripNo: this.trips.findIndex(y => x.getTrip() === y) + 1,
        trip: x.getTrip()?.persistDeep(),
        side: (x.getAppearanceId() === 'vez' && x.getFacing() === TrackDirection.BA) ? WhichEnd.B : WhichEnd.A,
      })),
      trips: this.trips.map(t => t.persistDeep())
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(
      PositionOnTrack.fromData(obj.position as PositionData, store), 
      obj.wagons.map(id => store.get(id) as Wagon)
    );
    this.speed.load(obj.speed);
    this.setAutoMode(obj.autoMode);
    this.wagons.map(wagon => {
        wagon.setTrain(this);
        wagon.update();
    });
  }
}

function convert2(t: TrackDirection): WhichEnd {
    if (t === TrackDirection.AB) return WhichEnd.B;
    if (t === TrackDirection.BA) return WhichEnd.A;
    return null;
  }
  
  function convert(t: TrackDirection): WhichEnd {
    if (t === TrackDirection.AB) return WhichEnd.A;
    if (t === TrackDirection.BA) return WhichEnd.B;
    return null;
  }