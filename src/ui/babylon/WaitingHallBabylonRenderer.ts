import * as BABYLON from 'babylonjs';
import { injectable } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { WaitingHallRenderer } from '../../structs/Renderers/WaitingHallRenderer';
import { WaitingHall } from '../../modules/Station/WaitingHall';

@injectable()
export class WaitingHallBabylonRenderer extends BaseBabylonRenderer
    implements WaitingHallRenderer {

    init(waitingHall: WaitingHall): void {
        return;
    }
}
