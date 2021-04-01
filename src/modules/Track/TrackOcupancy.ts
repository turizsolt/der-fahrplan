import { Wagon } from '../../structs/Interfaces/Wagon';

export interface TrackOcupancy {
  checkin(engine: Wagon);
  checkout(engine: Wagon);
  isEmpty(): boolean;
  getCheckedList(): Wagon[];
}
