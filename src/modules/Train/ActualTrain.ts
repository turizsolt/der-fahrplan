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
import { Passenger } from '../../structs/Interfaces/Passenger';
import { Station } from '../../structs/Scheduling/Station';
import { Platform } from '../../structs/Interfaces/Platform';
import { BlockJoint } from '../Signaling/BlockJoint';
import { WagonConfig } from '../../structs/Actuals/Wagon/WagonConfig';

export class ActualTrain extends ActualBaseStorable implements Train {
  private position: PositionOnTrack = null;
  private wagons: Wagon[] = [];
  private speed: TrainSpeed = null;
  private autoMode: boolean = false;
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

  setShunting(shunting: boolean): void {
    this.speed.setShunting(shunting);
    // just for the sidebar
    this.wagons.map(wagon => wagon.update());
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
    // just for the sidebar
    this.wagons.map(wagon => wagon.update());
  }

  merge(otherTrain: Train): void {
    this.wagons.push(...otherTrain.getWagons());
    otherTrain.getWagons().map(wagon => wagon.setTrain(this));
    otherTrain.removeAndKeepWagons();
    this.alignAxles();
    this.wagons.map(wagon => wagon.update());
  }

  createWagonAtEnd(config: WagonConfig): void {
    const wagon = this.store.create(TYPES.Wagon) as Wagon;
    wagon.init(config, this);
    wagon.setTrip(this.trips?.[0]);
    this.wagons.push(wagon);
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
    if (this.speed.getSpeed() !== 0) return;

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
    start.addMarkerBothDirections(this.position.getPosition(), { type: 'Train', train: this });
    end.addMarkerBothDirections(this.getEndPosition().getPosition(), { type: 'Train', train: this });
  }

  private clearMarkers(): void {
    const start = this.position.getDirectedTrack();
    const end = this.getEndPosition().getDirectedTrack();
    start.removeMarkerBothDirections({ type: 'Train', train: this });
    end.removeMarkerBothDirections({ type: 'Train', train: this });
  }

  private alignAxles(): void {
    if (!this.position) return;

    const formerStart = Util.first(this.wagons).getAxlePosition(WhichEnd.A);
    const formerEnd = Util.last(this.wagons).getAxlePosition(WhichEnd.B);

    // checkouts
    let iter = this.getEndPosition()?.getDirectedTrack();
    if (iter) {
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

    if (formerEnd) {
      const iter = MarkerIterator.fromPositionOnTrack(formerEnd, currentEnd);
      let next: { value: TrackMarker, directedTrack: DirectedTrack, position: number, positionOnTrack: PositionOnTrack } = iter.nextOfFull('BlockJoint');
      while (next && next.value) {
        const bjend: BlockEnd = next.value.blockJoint.getEnd(convertTo(next.value.blockJoint, next.positionOnTrack));
        const send: SectionEnd = next.value.blockJoint.getSectionEnd(convertTo(next.value.blockJoint, next.positionOnTrack));
        if (bjend) {
          // console.log('bjend out', bjend.getHash());
          bjend.checkout(this);
        }
        if (send) {
          // console.log('send out', send.getSection().getId());
          send.checkout(this);

        }
        next = iter.nextOfFull('BlockJoint');
      }
    }

    // block checkin
    if (formerStart) {
      const iter = MarkerIterator.fromPositionOnTrack(formerStart, currentStart);
      let next: { value: TrackMarker, directedTrack: DirectedTrack, position: number, positionOnTrack: PositionOnTrack } = iter.nextOfFull('BlockJoint');
      while (next && next.value) {
        const bjend: BlockEnd = next.value.blockJoint.getEnd(convertFrom(next.value.blockJoint, next.positionOnTrack));
        const send: SectionEnd = next.value.blockJoint.getSectionEnd(convertFrom(next.value.blockJoint, next.positionOnTrack));
        if (bjend) {
          // console.log('bjend in', bjend.getHash());
          bjend.checkin(this);
        }
        if (send) {
          // console.log('send in', send.getSection().getId());
          send.checkin(this);
        }
        next = iter.nextOfFull('BlockJoint');
      }
    }

    // sensor checkin
    if (formerStart) {
      const iter = MarkerIterator.fromPositionOnTrack(formerStart, currentStart);
      let next: { value: TrackMarker, directedTrack: DirectedTrack } = iter.nextOfFull('Sensor');
      while (next && next.value) {
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
    this.wagons.map(w => w.update());
  }

  getAutoMode(): boolean {
    return this.autoMode;
  }

  private lastSpeed: number = -1;

  private nearestEnd: NearestData = null;
  private nearestTrain: NearestData = null;
  private nearestSignal: NearestData = null;
  private nearestPlatform: NearestData = null;

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

  private nextPlatformToStop: Platform = null;
  private lastPlatformStopped: Platform = null;
  private justPlatformStopped: Platform = null;
  private remainingStopTime: number = 0;
  private shouldTurn: boolean = false;

  tick(): void {
    const nextPosition = this.position.clone();

    this.nearestEnd = Nearest.end(nextPosition);
    this.nearestTrain = Nearest.train(nextPosition);
    this.nearestSignal = Nearest.signal(nextPosition);
    this.nearestPlatform = Nearest.platform(nextPosition);

    if (this.autoMode) {
      let pedal = SpeedPedal.Throttle;
      if (this.nearestSignal.signal) {
        if (this.nearestSignal.signal.getSignal() === SignalSignal.Red &&
          (this.speed.getStoppingDistance() + 5) >= this.nearestSignal.distance) {
          pedal = SpeedPedal.Brake;
        }
      }


      if (this.nearestPlatform.platform
        && this.nearestPlatform.platform !== this.lastPlatformStopped) {
        if (
          ((this.speed.getStoppingDistance() + 5 >= this.nearestPlatform.distance)
            && this.speed.getSpeed() > 1)
          || (this.speed.getStoppingDistance() + 2 >= this.nearestPlatform.distance)) {

          pedal = SpeedPedal.Brake;

          if (!this.nextPlatformToStop) {
            this.nextPlatformToStop = this.nearestPlatform.platform;
            this.remainingStopTime = 60; // todo constant
          }
        }
      }
      this.speed.setPedal(pedal);
    }

    this.speed.tick();
    if (this.speed.getSpeed() === 0 && this.lastSpeed === 0) {
      this.wagons.map(wagon => wagon.update());
    }
    this.lastSpeed = this.speed.getSpeed();

    if (this.speed.getSpeed() === 0 && this.nextPlatformToStop) {
      this.remainingStopTime--;
      if (!this.justPlatformStopped) {
        this.justPlatformStopped = this.nextPlatformToStop;
        this.startStopping();
      }
      if (this.remainingStopTime < 1 && this.isTimeToGo()) {
        this.lastPlatformStopped = this.nextPlatformToStop;
        this.nextPlatformToStop = null;

        this.endStopping();
        this.justPlatformStopped = null;
      }
    }

    if (this.speed.getSpeed() === 0) {
      return;
    }

    nextPosition.move(this.speed.getSpeed());

    // todo
    // added extra condition to solve the reverse -> same wagon twice in train problem
    // but should investigate deeper
    if (this.nearestTrain.distance < WAGON_GAP && this.nearestTrain.train !== this) {
      const frontDist = this.nearestTrain.train.getPosition().getRay().coord.distance2d(this.position.getRay().coord);
      const rearDist = this.nearestTrain.train.getEndPosition().getRay().coord.distance2d(this.position.getRay().coord);
      if (frontDist < rearDist) {
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

    this.moveBoardedPassengers();
  }

  private isTimeToGo(): boolean {
    if (this.trips.length === 0) return true;
    const depTime: number = this.trips[0].getStationDepartureTime(this.justPlatformStopped.getStation());
    return !depTime || depTime <= this.store.getTickCount();
  }

  private startStopping(): void {
    this.shouldTurn = false;
    if (this.justPlatformStopped.getStation()) {
      this.trips.map(t => t.setStationServed(this.justPlatformStopped.getStation()));
    }
    this.wagons[0].stop();
    const lastStop = this.trips.length > 0 ? Util.last(this.trips[0].getStops()) : null;
    if (lastStop && lastStop.station === this.justPlatformStopped.getStation()) {
      this.arrivedToLastStation();
    }
  }

  private arrivedToLastStation() {
    const newTrip = this.trips.length > 0 ? this.trips[0].getNextTrip() : null;
    if (newTrip) {
      this.assignTrip(null);
      this.assignTrip(newTrip);
      this.shouldTurn = true;
    }
  }

  private endStopping(): void {
    if (this.justPlatformStopped.getStation()) {
      this.trips.map(t => t.setAtStation(null));
    }
    this.wagons[0].stop();
    if (this.shouldTurn) {
      this.reverse();
    }
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'Train',
      autoMode: this.getAutoMode(),
      position: this.position?.persist(),
      speed: this.speed?.persist(),
      wagons: this.wagons.map(wagon => ({
        wagon: wagon.getId(),
        trip: wagon.getTrip()?.getId()
      })),
      trips: this.trips.map(t => t.getId())
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

  // boarding and announcements

  stoppedAt(station: Station, platform: Platform) {
    if (this.speed.getSpeed() > 0) return;

    this.getTrips().map(trip => {
      this.callOnPassengers((p: Passenger) => {
        p.listenWagonStoppedAtAnnouncement(
          station,
          platform,
          this,
          trip.getRoute()
        );
      });
      if (station) {
        station.announceArrived(this, platform, trip);
      }
    });
  }

  moveBoardedPassengers(): void {
    for (let wagon of this.getWagons()) {
      wagon.moveBoardedPassengers();
    }
  }

  private callOnPassengers(f: (p: Passenger) => void): void {
    for (let wagon of this.getWagons()) {
      wagon.getBoardedPassengers().map(p => f(p));
    }
  }

  getFreeWagon(): Wagon {
    for (let wagon of this.getWagons()) {
      if (wagon.hasFreeSeat()) {
        return wagon;
      }
    }
    return null;
  }

  /* persist and load */


  load(obj: any, store: Store): void {
    const m: Record<string, Trip> = {};
    const wagons: Wagon[] = obj.wagons.map(wagon => {
      const ret: Wagon = store.get(wagon.wagon) as Wagon;
      m[wagon.wagon] = store.get(wagon.trip) as Trip;
      return ret;
    });
    this.presetId(obj.id);
    this.init(
      PositionOnTrack.fromData(obj.position as PositionData, store),
      wagons
    );
    this.speed.load(obj.speed);
    this.setAutoMode(obj.autoMode);
    this.wagons.map(wagon => {
      wagon.setTrain(this);
      this.assignTrip(m[wagon.getId()], [wagon]);
      wagon.update();
    });
  }
}

export function convertFrom(bj: BlockJoint, pos: PositionOnTrack): WhichEnd {
  const tdbj = bj
    .getPosition()
    .getDirectedTrack()
    .getDirection();
  const tdpos = pos.getDirectedTrack().getDirection();

  if (tdbj === tdpos) {
    return WhichEnd.B;
  } else {
    return WhichEnd.A;
  }
}

export function convertTo(bj: BlockJoint, pos: PositionOnTrack): WhichEnd {
  const tdbj = bj
    .getPosition()
    .getDirectedTrack()
    .getDirection();
  const tdpos = pos.getDirectedTrack().getDirection();

  if (tdbj === tdpos) {
    return WhichEnd.A;
  } else {
    return WhichEnd.B;
  }
}