import { Train } from '../Train/Train';
import { Signal } from '../Signaling/Signal';

export interface TrackMarker {
  type: 'Train' | 'Signal';
  train?: Train;
  signal?: Signal;
}
