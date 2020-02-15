import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import { PassengerRenderer } from '../src/structs/Passenger/PassengerRenderer';
import { TYPES } from '../src/structs/TYPES';
import { PassengerDummyRenderer } from '../src/structs/Passenger/PassengerDummyRenderer';
import { EngineRenderer } from '../src/structs/Engine/EngineRenderer';
import { EngineDummyRenderer } from '../src/structs/Engine/EngineDummyRenderer';
import { TrackJointRenderer } from '../src/structs/TrackJoint/TrackJointRenderer';
import { TrackJointDummyRenderer } from '../src/structs/TrackJoint/TrackJointDummyRenderer';
import { TrackRenderer } from '../src/structs/Track/TrackRenderer';
import { TrackDummyRenderer } from '../src/structs/Track/TrackDummyRenderer';
import { TrackSwitchRenderer } from '../src/structs/TrackSwitch/TrackSwitchRenderer';
import { TrackSwitchDummyRenderer } from '../src/structs/TrackSwitch/TrackSwitchDummyRenderer';
import { ActualEngine } from '../src/structs/Engine/ActualEngine';
import { Engine } from '../src/structs/Engine/Engine';
import { Track } from '../src/structs/Track/Track';
import { ActualTrack } from '../src/structs/Track/ActualTrack';
import { TrackSwitch } from '../src/structs/TrackSwitch/TrackSwitch';
import { ActualTrackSwitch } from '../src/structs/TrackSwitch/ActualTrackSwitch';
import { TrackJoint } from '../src/structs/TrackJoint/TrackJoint';
import { ActualTrackJoint } from '../src/structs/TrackJoint/ActualTrackJoint';
import { Store } from '../src/structs/Store/Store';

export const testContainer = new Container();
testContainer
  .bind<PassengerRenderer>(TYPES.PassengerRenderer)
  .to(PassengerDummyRenderer);
testContainer
  .bind<EngineRenderer>(TYPES.EngineRenderer)
  .to(EngineDummyRenderer);
testContainer
  .bind<TrackJointRenderer>(TYPES.TrackJointRenderer)
  .to(TrackJointDummyRenderer);
testContainer.bind<TrackRenderer>(TYPES.TrackRenderer).to(TrackDummyRenderer);
testContainer
  .bind<TrackSwitchRenderer>(TYPES.TrackSwitchRenderer)
  .to(TrackSwitchDummyRenderer);

testContainer.bind<Engine>(TYPES.Engine).to(ActualEngine);
testContainer.bind<Track>(TYPES.Track).to(ActualTrack);
testContainer.bind<TrackJoint>(TYPES.TrackJoint).to(ActualTrackJoint);
testContainer.bind<TrackSwitch>(TYPES.TrackSwitch).to(ActualTrackSwitch);
testContainer.bind<Store>(TYPES.Store).to(Store);

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
