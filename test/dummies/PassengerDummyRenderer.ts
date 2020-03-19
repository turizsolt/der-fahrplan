import { Passenger } from '../../src/structs/Actuals/Passenger';
import { PassengerRenderer } from '../../src/structs/Renderers/PassengerRenderer';
import { injectable } from 'inversify';

@injectable()
export class PassengerDummyRenderer implements PassengerRenderer {
  init(_: Passenger): void {}
  update() {}
}
