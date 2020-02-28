import { Land } from './Land';
import { Engine } from '../Engine/Engine';
import { TrackJoint } from '../TrackJoint/TrackJoint';
import { injectable, inject } from 'inversify';
import { TYPES } from '../TYPES';
import { babylonContainer } from '../inversify.config';
import { OldController } from '../../controllers/OldController';

@injectable()
export class ActualLand implements Land {
  @inject(TYPES.FactoryOfEngine) engineFactory: () => Engine;

  init(controller: OldController): Engine {
    const j1 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
    j1.init(0, 0, 0);
    const j2 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
    j2.init(0, 20, 0);
    const j3 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
    j3.init(20, 40, Math.PI / 2);
    const j4 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
    j4.init(40, 40, Math.PI / 2);
    const { track: tr0 } = j2.connect(j1);
    j3.connect(j2);
    j4.connect(j3);

    //controller.setLastJoint(j4);

    const engine = this.engineFactory().init();
    engine.putOnTrack(tr0);

    return engine;
  }
}
