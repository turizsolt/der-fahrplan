import { Passenger } from '../../src/modules/Passenger/Passenger';
import { PassengerRenderer } from '../../src/structs/Renderers/PassengerRenderer';
import { injectable } from 'inversify';

@injectable()
export class PassengerDummyRenderer implements PassengerRenderer {
    setSelected(selected: boolean): void { }
    isSelected(): boolean {
        return false;
    }
    process(command: string): void { }
    remove() { }
    init(_: Passenger): void { }
    update() { }
}
