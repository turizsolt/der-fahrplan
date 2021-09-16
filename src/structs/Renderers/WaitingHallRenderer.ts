import { BaseRenderer } from './BaseRenderer';
import { WaitingHall } from '../../modules/Station/WaitingHall';

export interface WaitingHallRenderer extends BaseRenderer {
    init(waitingHall: WaitingHall): void;
}
