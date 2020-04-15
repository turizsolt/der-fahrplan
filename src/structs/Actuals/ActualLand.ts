import { Land } from '../Interfaces/Land';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/TYPES';
import { PassengerGenerator } from './PassengerGenerator';

@injectable()
export class ActualLand implements Land {
  @inject(TYPES.PassengerGenerator) passengerGenerator: PassengerGenerator;

  init(): void {
    this.passengerGenerator.init();
  }
}
