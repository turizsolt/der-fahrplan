import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import { PassengerRenderer } from '../src/structs/Renderers/PassengerRenderer';
import { TYPES } from '../src/structs/TYPES';
import { PassengerDummyRenderer } from './dummies/PassengerDummyRenderer';
import { EngineRenderer } from '../src/structs/Renderers/EngineRenderer';
import { EngineDummyRenderer } from './dummies/EngineDummyRenderer';
import { TrackJointRenderer } from '../src/structs/Renderers/TrackJointRenderer';
import { TrackJointDummyRenderer } from './dummies/TrackJointDummyRenderer';
import { TrackRenderer } from '../src/structs/Renderers/TrackRenderer';
import { TrackDummyRenderer } from './dummies/TrackDummyRenderer';
import { TrackSwitchRenderer } from '../src/structs/Renderers/TrackSwitchRenderer';
import { TrackSwitchDummyRenderer } from './dummies/TrackSwitchDummyRenderer';
import { ActualEngine } from '../src/structs/Actuals/Wagon/ActualEngine';
import { Engine } from '../src/structs/Interfaces/Engine';
import { Track } from '../src/structs/Interfaces/Track';
import { ActualTrack } from '../src/structs/Actuals/Track/ActualTrack';
import { TrackSwitch } from '../src/structs/Interfaces/TrackSwitch';
import { ActualTrackSwitch } from '../src/structs/Actuals/Track/ActualTrackSwitch';
import { TrackJoint } from '../src/structs/Interfaces/TrackJoint';
import { ActualTrackJoint } from '../src/structs/Actuals/TrackJoint/ActualTrackJoint';
import { Store } from '../src/structs/Actuals/Store/Store';
import { PlatformRenderer } from '../src/structs/Renderers/PlatformRenderer';
import { PlatformDummyRenderer } from './dummies/PlatformDummyRenderer';
import { Platform } from '../src/structs/Interfaces/Platform';
import { ActualPlatform } from '../src/structs/Actuals/ActualPlatform';
import { TrackJointConnector } from '../src/structs/Actuals/TrackJoint/TrackJointConnector';
import { Wagon } from '../src/structs/Interfaces/Wagon';
import { ActualWagon } from '../src/structs/Actuals/Wagon/ActualWagon';
import { WagonRenderer } from '../src/structs/Renderers/WagonRenderer';
import { WagonDummyRenderer } from './dummies/WagonDummyRenderer';

export const testContainer = new Container();
testContainer
  .bind<PassengerRenderer>(TYPES.PassengerRenderer)
  .to(PassengerDummyRenderer);
testContainer
  .bind<EngineRenderer>(TYPES.EngineRenderer)
  .to(EngineDummyRenderer);
testContainer.bind<WagonRenderer>(TYPES.WagonRenderer).to(WagonDummyRenderer);
testContainer
  .bind<TrackJointRenderer>(TYPES.TrackJointRenderer)
  .to(TrackJointDummyRenderer);
testContainer.bind<TrackRenderer>(TYPES.TrackRenderer).to(TrackDummyRenderer);
testContainer
  .bind<TrackSwitchRenderer>(TYPES.TrackSwitchRenderer)
  .to(TrackSwitchDummyRenderer);
testContainer
  .bind<PlatformRenderer>(TYPES.PlatformRenderer)
  .to(PlatformDummyRenderer);

testContainer.bind<Engine>(TYPES.Engine).to(ActualEngine);
testContainer.bind<Wagon>(TYPES.Wagon).to(ActualWagon);
testContainer.bind<Track>(TYPES.Track).to(ActualTrack);
testContainer.bind<TrackJoint>(TYPES.TrackJoint).to(ActualTrackJoint);
testContainer.bind<TrackSwitch>(TYPES.TrackSwitch).to(ActualTrackSwitch);
testContainer.bind<Platform>(TYPES.Platform).to(ActualPlatform);
testContainer.bind<Store>(TYPES.Store).to(Store);
testContainer
  .bind<TrackJointConnector>(TYPES.TrackJointConnector)
  .to(TrackJointConnector);

let connector: TrackJointConnector = null;
testContainer
  .bind<interfaces.Factory<TrackJointConnector>>(
    TYPES.FactoryOfTrackJointConnector
  )
  .toFactory<TrackJointConnector>((context: interfaces.Context) => {
    return () => {
      if (!connector) {
        connector = context.container.get<TrackJointConnector>(
          TYPES.TrackJointConnector
        );
      }
      return connector;
    };
  });
let store: Store = null;
testContainer
  .bind<interfaces.Factory<Store>>(TYPES.FactoryOfStore)
  .toFactory<Store>((context: interfaces.Context) => {
    return () => {
      if (!store) {
        store = context.container.get<Store>(TYPES.Store).init();
      }
      return store;
    };
  });

testContainer
  .bind<interfaces.Factory<Engine>>(TYPES.FactoryOfEngine)
  .toFactory<Engine>((context: interfaces.Context) => {
    return () => {
      return context.container.get<Engine>(TYPES.Engine);
    };
  });

testContainer
  .bind<interfaces.Factory<Wagon>>(TYPES.FactoryOfWagon)
  .toFactory<Wagon>((context: interfaces.Context) => {
    return () => {
      return context.container.get<Wagon>(TYPES.Wagon);
    };
  });

testContainer
  .bind<interfaces.Factory<Track>>(TYPES.FactoryOfTrack)
  .toFactory<Track>(context => {
    return () => {
      return context.container.get<Track>(TYPES.Track);
    };
  });

testContainer
  .bind<interfaces.Factory<TrackSwitch>>(TYPES.FactoryOfTrackSwitch)
  .toFactory<TrackSwitch>((context: interfaces.Context) => {
    return () => {
      return context.container.get<TrackSwitch>(TYPES.TrackSwitch);
    };
  });

testContainer
  .bind<interfaces.Factory<TrackJoint>>(TYPES.FactoryOfTrackJoint)
  .toFactory<TrackJoint>((context: interfaces.Context) => {
    return () => {
      return context.container.get<TrackJoint>(TYPES.TrackJoint);
    };
  });

testContainer
  .bind<interfaces.Factory<Platform>>(TYPES.FactoryOfPlatform)
  .toFactory<Platform>((context: interfaces.Context) => {
    return () => {
      return context.container.get<Platform>(TYPES.Platform);
    };
  });
