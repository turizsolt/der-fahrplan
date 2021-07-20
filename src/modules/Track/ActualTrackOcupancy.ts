import { TrackOcupancy } from './TrackOcupancy';
import { Train } from '../Train/Train';

export class ActualTrackOcupancy implements TrackOcupancy {
  protected checkedList: Train[] = [];

  checkin(train: Train) {
    this.checkedList.push(train);
  }

  checkout(train: Train) {
    this.checkedList = this.checkedList.filter(elem => elem !== train);
  }

  isEmpty(): boolean {
    return this.checkedList.length === 0;
  }

  getCheckedList(): Train[] {
    return this.checkedList;
  }
}
