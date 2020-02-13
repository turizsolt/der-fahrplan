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
import { Land } from '../src/structs/Land/Land';
import { ActualLand } from '../src/structs/Land/ActualLand';
import { ActualEngine } from '../src/structs/Engine/ActualEngine';
import { Engine } from '../src/structs/Engine/Engine';
import { Track } from '../src/structs/Track/Track';
import { ActualTrack } from '../src/structs/Track/ActualTrack';
import { TrackSwitch } from '../src/structs/TrackSwitch/TrackSwitch';
import { ActualTrackSwitch } from '../src/structs/TrackSwitch/ActualTrackSwitch';
import { Coordinate } from '../src/structs/Geometry/Coordinate';

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

testContainer.bind<Land>(TYPES.Land).to(ActualLand);
testContainer.bind<Engine>(TYPES.Engine).to(ActualEngine);
testContainer.bind<Track>(TYPES.Track).to(ActualTrack);
testContainer.bind<TrackSwitch>(TYPES.TrackSwitch).to(ActualTrackSwitch);

testContainer
  .bind<interfaces.Factory<Engine>>(TYPES.FactoryOfEngine)
  .toFactory<Engine>((context: interfaces.Context) => {
    return () => {
      return context.container.get<Engine>(TYPES.Engine);
    };
  });

testContainer
  .bind<interfaces.Factory<Track>>('Factory<Track>')
  .toFactory<Track>(context => {
    return (coordinates: Coordinate[]) => {
      let track = context.container.get<Track>('Track');
      // track.setSegment(coordinates);
      return track;
    };
  });

testContainer
  .bind<interfaces.Factory<TrackSwitch>>(TYPES.TrackSwitch)
  .toFactory<TrackSwitch>((context: interfaces.Context) => {
    return () => {
      return context.container.get<TrackSwitch>(TYPES.TrackSwitch);
    };
  });
