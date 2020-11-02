import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Train } from './Train';
import { Wagon } from '../Interfaces/Wagon';
import { Route } from './Route';
import { Platform } from '../Interfaces/Platform';
import { Station } from './Station';
import { Passenger } from '../Interfaces/Passenger';
import { WagonControlType } from '../Actuals/Wagon/WagonControl/WagonControlType';

export class ActualTrain extends ActualBaseStorable implements Train {
  private wagons: Wagon[];
  private schedulingWagon: Wagon;

  init(first: Wagon): Train {
    super.initStore(TYPES.Train);
    this.wagons = [first];
    this.schedulingWagon = first;
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
    if (!other.getTrip()) {
      for (let wagon of other.getWagons()) {
        wagon.setTrain(this);
      }
      this.wagons = [...this.wagons, ...other.getWagons()];
      other.remove();
    } else if (!this.getTrip()) {
      other.mergeWith(this);
    } else {
      for (let wagon of other.getWagons()) {
        wagon.setTrain(this);
      }
      this.wagons = [...this.wagons, ...other.getWagons()];
      other.getWagons().map(wagon => wagon.assignTrip(null)); // extra compared above
      other.remove();
    }
  }

  separateThese(wagons: Wagon[]): void {
    let newTrain: Train;
    if (wagons.includes(this.schedulingWagon)) {
      this.schedulingWagon.setTrain(undefined);
      newTrain = this.schedulingWagon.getTrain();
    } else {
      wagons[0].setTrain(undefined);
      newTrain = wagons[0].getTrain();
    }
    ////
    for (let wagon of wagons) {
      this.wagons = this.wagons.filter(x => x !== wagon);
      wagon.setTrain(newTrain);
    }
    newTrain.setWagons(wagons);
    ////
    if (wagons.includes(this.schedulingWagon)) {
      this.setSchedulingWagon(this.wagons[0]);
    }
  }

  getTrip(): Route {
    return this.schedulingWagon.getTrip();
  }

  getSchedulingWagon(): Wagon {
    return this.schedulingWagon;
  }

  setSchedulingWagon(schWagon: Wagon): void {
    this.schedulingWagon = schWagon;
    for (let wagon of this.wagons) {
      if (wagon !== schWagon) {
        wagon.assignTrip(null);
        wagon.update();
      }
    }
  }

  cancelTrip(): void {
    this.schedulingWagon.assignTrip(null);
    for (let wagon of this.wagons) {
      wagon.update();
    }
  }

  setWagons(wagons: Wagon[]) {
    this.wagons = wagons;
  }

  stoppedAt(station: Station, platform: Platform) {
    this.callOnPassengers((p: Passenger) => {
      p.listenWagonStoppedAtAnnouncement(
        station,
        platform,
        this,
        this.getTrip()
      );
    });
    if (station) {
      station.announceArrived(this, platform, this.getTrip());
    }
  }

  moveBoardedPassengers(): void {
    for (let wagon of this.wagons) {
      wagon.moveBoardedPassengers();
    }
  }

  private callOnPassengers(f: (p: Passenger) => void): void {
    for (let wagon of this.wagons) {
      wagon.getBoardedPassengers().map(p => f(p));
    }
  }

  getFreeWagon(): Wagon {
    for (let wagon of this.wagons) {
      if (wagon.hasFreeSeat()) {
        return wagon;
      }
    }
    return null;
  }

  hasLocomotive(): boolean {
    return (
      this.wagons.filter(
        x => x.getControlType() === WagonControlType.Locomotive
      ).length > 0
    );
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'Train',
      wagons: this.wagons.map(x => x.getId()),
      schedulingWagon: this.schedulingWagon.getId()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(store.get(obj.schedulingWagon) as Wagon);
    this.wagons = obj.wagons.map(x => store.get(x) as Wagon);
    for (let wagon of this.wagons) {
      wagon.setTrain(this);
    }
  }
}
