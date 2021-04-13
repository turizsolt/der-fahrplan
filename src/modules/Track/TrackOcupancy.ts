import { Train } from '../Train/Train';

export interface TrackOcupancy {
  checkin(train: Train): void;
  checkout(train: Train): void;
  isEmpty(): boolean;
  getCheckedList(): Train[];
}
