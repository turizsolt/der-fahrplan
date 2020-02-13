import { Land } from './Land';
import { Engine } from '../Engine/Engine';
import { TrackJoint } from '../TrackJoint/TrackJoint';
import { injectable, inject } from 'inversify';
import { TYPES } from '../TYPES';
import { babylonContainer } from '../inversify.config';

@injectable()
export class ActualLand implements Land {
  @inject(TYPES.FactoryOfEngine) engineFactory: () => Engine;

  init(markers: any[]): Engine {
    const j1 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
    j1.init(0, 0, 0);
    const j2 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
    j2.init(0, 20, 0);
    const { track: tr0 } = j2.connect(j1);

    markers.push(j1);
    markers.push(j2);

    const engine = this.engineFactory();
    engine.putOnTrack(tr0);

    return engine;
  }
}
