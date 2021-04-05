import { BaseStorable } from '../../structs/Interfaces/BaseStorable';
import { Wagon } from '../../structs/Interfaces/Wagon';

export interface Train2 extends BaseStorable {
  init(first: Wagon): Train2;
}
