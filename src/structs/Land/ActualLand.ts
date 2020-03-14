import { Land } from './Land';
import { Engine } from '../Engine/Engine';
import { TrackJoint } from '../TrackJoint/TrackJoint';
import { injectable, inject } from 'inversify';
import { TYPES } from '../TYPES';
import { babylonContainer } from '../inversify.config';

@injectable()
export class ActualLand implements Land {
  @inject(TYPES.FactoryOfEngine) engineFactory: () => Engine;

  init(): Engine {
    const j0 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
    j0.init(-10, 0, Math.PI / 4);
    const jk = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
    jk.init(-10, 20, Math.PI / 4);
    const j1 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
    j1.init(0, 0, 0);
    const j2 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
    j2.init(0, 20, 0);
    const j3 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
    j3.init(10, 40, Math.PI / 4);
    const j4 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
    j4.init(20, 60, 0);
    j2.connect(j1);
    j2.connect(j0);
    j3.connect(jk);
    j3.connect(j2);
    const { track } = j4.connect(j3);

    setTimeout(() => {
      const engine = this.engineFactory();
      engine.init().putOnTrack(track);
    }, 1000);

    return null;
  }
}
