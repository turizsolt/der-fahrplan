import { TrackBase } from '../TrackBase/TrackBase';
import { Wagon } from './Wagon';

export class TrackWorm {
  constructor(private list: TrackBase[], private wagon: Wagon) {
    this.list.map(x => x.checkin(wagon));
  }

  getAll(): TrackBase[] {
    return this.list;
  }

  checkoutAll(): void {
    this.list.map(x => x.checkout(this.wagon));
    this.list = [];
  }

  moveForward(newList: TrackBase[]) {
    let i = 0;
    let n = 0;
    while (newList[n] !== this.list[i] && i < this.list.length) {
      this.list[i].checkout(this.wagon);
      i++;
    }

    while (
      newList[n] === this.list[i] &&
      i < this.list.length &&
      n < newList.length
    ) {
      i++;
      n++;
    }

    while (n < newList.length) {
      newList[n].checkin(this.wagon);
      n++;
    }

    this.list = newList;
  }

  moveBackward(newList: TrackBase[]) {
    let i = this.list.length - 1;
    let n = newList.length - 1;
    while (newList[n] !== this.list[i] && i > -1) {
      this.list[i].checkout(this.wagon);
      i--;
    }

    while (newList[n] === this.list[i] && i > -1 && n > -1) {
      i--;
      n--;
    }

    while (n > -1) {
      newList[n].checkin(this.wagon);
      n--;
    }

    this.list = newList;
  }
}
