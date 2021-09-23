import { BaseRenderer } from './BaseRenderer';
import { Station } from '../../modules/Station/Station';

export interface StationRenderer extends BaseRenderer {
    init(station: Station): void;
}
