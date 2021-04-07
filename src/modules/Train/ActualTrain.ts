import { ActualBaseStorable } from '../../structs/Actuals/ActualStorable';
import { Store } from '../../structs/Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Train } from './Train';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { Platform } from '../../structs/Interfaces/Platform';
import { Station } from '../../structs/Scheduling/Station';
import { Passenger } from '../../structs/Interfaces/Passenger';
import { WagonControlType } from '../../structs/Actuals/Wagon/WagonControl/WagonControlType';
import { WagonWithSide, WagonIdWithSide } from '../../structs/Interfaces/WagonWithSide';
import { WhichEnd, otherEnd } from '../../structs/Interfaces/WhichEnd';
import { Trip } from '../../structs/Scheduling/Trip';

export class ActualTrain extends ActualBaseStorable implements Train {
  private wagonsWithSides: WagonWithSide[] = [];
  private trips: Trip[] = [];
  private controlingWagon: Wagon = null;
  private lastControlingWagon: Wagon = null;
  private removed: boolean = false;

  init(first: Wagon): Train {
    super.initStore(TYPES.Train);
    this.wagonsWithSides = [{ wagon: first, side: WhichEnd.A }];
    return this;
  }

  remove(): void {
    this.store.unregister(this);
    this.removed = true;
  }

  isRemoved(): boolean {
    return this.removed;
  }

  getWagons(): Wagon[] {
    return this.wagonsWithSides.map(x => x.wagon);
  }

  getWagonsWithSides(): WagonWithSide[] {
    return this.wagonsWithSides;
  }

  getWagonIdsWithSides(): WagonIdWithSide[] {
    return this.wagonsWithSides.map(x => ({
      wagonId: x.wagon.getId(),
      side: x.side
    }));
  }

  whichEndIsOn(end: any): WhichEnd {
    if (this.wagonsWithSides[0].wagon === end.getEndOf()) {
      if (this.wagonsWithSides[0].side === end.getWhichEnd()) {
        return WhichEnd.A;
      }
    }

    const last = this.wagonsWithSides.length - 1;
    if (this.wagonsWithSides[last].wagon === end.getEndOf()) {
      if (this.wagonsWithSides[last].side === otherEnd(end.getWhichEnd())) {
        return WhichEnd.B;
      }
    }

    return null;
  }

  mergeWith(thisEnd: any, other: Train, otherEnd: any): void {
    const thisWhichEnd = this.whichEndIsOn(thisEnd);
    const otherWhichEnd = other.whichEndIsOn(otherEnd);

    if (thisWhichEnd === WhichEnd.A && otherWhichEnd === WhichEnd.A) {
      this.wagonsWithSides = [
        ...rev(other.getWagonsWithSides()),
        ...this.getWagonsWithSides()
      ];
    } else if (thisWhichEnd === WhichEnd.A && otherWhichEnd === WhichEnd.B) {
      this.wagonsWithSides = [
        ...other.getWagonsWithSides(),
        ...this.getWagonsWithSides()
      ];
    } else if (thisWhichEnd === WhichEnd.B && otherWhichEnd === WhichEnd.A) {
      this.wagonsWithSides = [
        ...this.getWagonsWithSides(),
        ...other.getWagonsWithSides()
      ];
    } else if (thisWhichEnd === WhichEnd.B && otherWhichEnd === WhichEnd.B) {
      this.wagonsWithSides = [
        ...this.getWagonsWithSides(),
        ...rev(other.getWagonsWithSides())
      ];
    }

    for (let trip of other.getTrips()) {
      if (!this.trips.includes(trip)) {
        this.trips.push(trip);
      }
    }

    other.getWagons().map(wagon => wagon.setTrain(this));
    other.remove();

    this.updateTrips();
  }

  private updateTrips(): void {
    this.trips = this.trips.filter(t => this.wagonsWithSides.findIndex(w => w.trip === t) > -1);
  }

  separateThese(wagons: Wagon[]): void {
    const newWagonsWithSides = this.wagonsWithSides.filter(x =>
      wagons.includes(x.wagon)
    );
    const newTrain = this.store.create<Train>(TYPES.Train).init(wagons[0]);
    newTrain.setWagonsWithSides(newWagonsWithSides);
    newWagonsWithSides.map(x => {
      x.wagon.setTrain(newTrain);
      if (x.trip) {
        newTrain.assignTrip(x.trip, null);
      }
    });

    this.wagonsWithSides = this.wagonsWithSides.filter(
      x => !wagons.includes(x.wagon)
    );
    if (this.wagonsWithSides.length === 0) {
      this.remove();
    }
  }

  assignTrip(trip: Trip, wagons?: Wagon[]): void {
    let addedCount = 0;
    for (let i = 0; i < this.wagonsWithSides.length; i++) {
      if (
        (!wagons || wagons.includes(this.wagonsWithSides[i].wagon)) &&
        (this.wagonsWithSides[i].wagon.getPassengerCount())
      ) {
        addedCount++;
        this.wagonsWithSides[i].trip = trip;
      }
    }

    if (addedCount && trip && !this.trips.includes(trip)) {
      this.trips.push(trip);
    }

    if (!trip) {
      this.updateTrips();
    }
  }

  getTrips(): Trip[] {
    return this.trips;
  }

  removeTrip(trip: Trip): void {
    this.trips = this.trips.filter(t => t != trip);
    for (let i = 0; i < this.wagonsWithSides.length; i++) {
      if (this.wagonsWithSides[i].trip === trip) {
        this.wagonsWithSides[i].trip = undefined;
      }
    }
  }

  setWagonsWithSides(wagonsWithSides: WagonWithSide[]) {
    this.wagonsWithSides = wagonsWithSides;
  }

  setMovingness(movingness: boolean): void {
    let atStation: Station = null;

    if (!movingness) {
      this.getWagons().map(wagon => {
        const beside: Platform[] = wagon.platformsBeside();
        if (beside.length > 0) {
          atStation = beside[0].getStation();
        }
      });
    }

    this.trips.map(trip => {
      trip.setAtStation(atStation);
    });
  }

  // boarding and announcements

  stoppedAt(station: Station, platform: Platform) {
    if (this.controlingWagon) return;

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

  // controlling the train

  hasLocomotive(): boolean {
    return (
      this.getWagons().filter(
        x => x.getControlType() === WagonControlType.Locomotive
      ).length > 0
    );
  }

  getControlingWagon(): Wagon {
    return this.controlingWagon;
  }

  getLastControlingWagon(): Wagon {
    if (this.lastControlingWagon) {
      return this.lastControlingWagon;
    } else {
      return this.wagonsWithSides.find(x => x.wagon.getControlType() !== WagonControlType.Nothing)?.wagon;
    }
  }

  setControlingWagon(wagon: Wagon): void {
    if (!this.controlingWagon) {
      this.controlingWagon = wagon;
      this.lastControlingWagon = wagon;
    }
  }

  clearControlingWagon(): void {
    this.controlingWagon = null;
  }

  // persistance

  persist(): Object {
    return {
      id: this.id,
      type: 'Train',
      wagons: this.getWagonsWithSides().map(x => ({ trip: x.trip?.getId(), side: x.side, wagon: x.wagon.getId() }))
    };
  }

  persistDeep(): Object {
    return {
      id: this.id,
      type: 'Train',
      wagons: this.wagonsWithSides.map(x => ({
        id: x.wagon.getId(),
        appearanceId: x.wagon.getAppearanceId(),
        tripId: x.trip?.getId(),
        tripNo: this.trips.findIndex(y => x.trip === y) + 1,
        trip: x.trip?.persistDeep(),
        side: x.side,
      })),
      trips: this.trips.map(t => t.persistDeep())
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(store.get(obj.schedulingWagon) as Wagon);
    this.wagonsWithSides = obj.wagons.map(x => ({
      side: x.side,
      trip: store.get(x.trip) as Trip,
      wagon: store.get(x.wagon) as Wagon
    }));
    for (let wagonWithSide of this.wagonsWithSides) {
      wagonWithSide.wagon.setTrain(this);
      wagonWithSide.wagon.setTrip(wagonWithSide.trip);

      if (wagonWithSide.trip && !this.trips.includes(wagonWithSide.trip)) {
        this.trips.push(wagonWithSide.trip);
      }
    }
  }
}

// todo should put into some kind of utils

function rev(wagonsWithSides: WagonWithSide[]): WagonWithSide[] {
  return wagonsWithSides
    .reverse()
    .map(x => ({ wagon: x.wagon, side: otherEnd(x.side) }));
}
