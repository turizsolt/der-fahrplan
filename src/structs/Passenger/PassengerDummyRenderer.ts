import { Passenger } from './Passenger';
import { PassengerRenderer } from './PassengerRenderer';
import { injectable } from 'inversify';

@injectable()
export class PassengerDummyRenderer implements PassengerRenderer {
  init(_: Passenger): void {}
  update() {}
}
