import { Land } from './Land';
import { Engine } from '../Engine/Engine';
import { TrackJoint } from '../TrackJoint/TrackJoint';
import { injectable, inject } from 'inversify';
import { TYPES } from '../TYPES';

@injectable()
export class ActualLand implements Land {
  @inject(TYPES.FactoryOfEngine) engineFactory: () => Engine;

  init(markers: any[]): Engine {
    const j1 = new TrackJoint(0, 0, 0);
    const j2 = new TrackJoint(0, 20, 0);
    const { track: tr0 } = j2.connect(j1);

    markers.push(j1);
    markers.push(j2);

    const engine = this.engineFactory();
    engine.putOnTrack(tr0);

    return engine;
  }
}
