import { injectable } from 'inversify';
import { StationRenderer } from '../../src/structs/Renderers/StationRenderer';
import { Station } from '../../src/modules/Station/Station';

@injectable()
export class StationDummyRenderer implements StationRenderer {
    setSelected(selected: boolean): void { }
    isSelected(): boolean {
        return null;
    }
    process(command: string): void { }
    update() { }
    init(_: Station) { }
    remove(): void { }
}
