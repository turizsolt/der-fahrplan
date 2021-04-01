import { Wagon } from '../../structs/Interfaces/Wagon';
import { TrackOcupancy } from './TrackOcupancy';

export class ActualTrackOcupancy implements TrackOcupancy {
  protected checkedList: Wagon[] = [];

  checkin(engine: Wagon) {
    this.checkedList.push(engine);
  }

  checkout(engine: Wagon) {
    this.checkedList = this.checkedList.filter(elem => elem !== engine);
  }

  isEmpty(): boolean {
    return this.checkedList.length === 0;
  }

  getCheckedList(): Wagon[] {
    return this.checkedList;
  }
}
