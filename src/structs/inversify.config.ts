import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import { PassengerRenderer } from './Passenger/PassengerRenderer';
import { TYPES } from './TYPES';
import { PassengerBabylonRenderer } from './Passenger/PassengerBabylonRenderer';
import { EngineBabylonRenderer } from './Engine/EngineBabylonRenderer';
import { EngineRenderer } from './Engine/EngineRenderer';
import { TrackJointRenderer } from './TrackJoint/TrackJointRenderer';
import { TrackJointBabylonRenderer } from './TrackJoint/TrackJointBabylonRenderer';
import { TrackRenderer } from './Track/TrackRenderer';
import { TrackBabylonRenderer } from './Track/TrackBabylonRenderer';
import { TrackSwitchRenderer } from './TrackSwitch/TrackSwitchRenderer';
import { TrackSwitchBabylonRenderer } from './TrackSwitch/TrackSwitchBabylonRenderer';
import { Land } from './Land/Land';
import { ActualLand } from './Land/ActualLand';
import { Engine } from './Engine/Engine';
import { ActualEngine } from './Engine/ActualEngine';
import { Track } from './Track/Track';
import { TrackSwitch } from './TrackSwitch/TrackSwitch';
import { ActualTrack } from './Track/ActualTrack';
import { ActualTrackSwitch } from './TrackSwitch/ActualTrackSwitch';
import { TrackJoint } from './TrackJoint/TrackJoint';
import { ActualTrackJoint } from './TrackJoint/ActualTrackJoint';
import { Store } from './Store/Store';
import { PlatformRenderer } from './Platform/PlatformRenderer';
import { PlatformBabylonRenderer } from './Platform/PlatformBabylonRenderer';
import { Platform } from './Platform/Platform';
import { ActualPlatform } from './Platform/ActualPlatform';
import { TrackJointConnector } from './TrackJoint/TrackJointConnector';

export const babylonContainer = new Container();
babylonContainer
  .bind<PassengerRenderer>(TYPES.PassengerRenderer)
  .to(PassengerBabylonRenderer);
babylonContainer
  .bind<EngineRenderer>(TYPES.EngineRenderer)
  .to(EngineBabylonRenderer);
babylonContainer
  .bind<TrackJointRenderer>(TYPES.TrackJointRenderer)
  .to(TrackJointBabylonRenderer);
babylonContainer
  .bind<TrackRenderer>(TYPES.TrackRenderer)
  .to(TrackBabylonRenderer);
babylonContainer
  .bind<TrackSwitchRenderer>(TYPES.TrackSwitchRenderer)
  .to(TrackSwitchBabylonRenderer);
babylonContainer
  .bind<PlatformRenderer>(TYPES.PlatformRenderer)
  .to(PlatformBabylonRenderer);

babylonContainer.bind<Land>(TYPES.Land).to(ActualLand);
babylonContainer.bind<Engine>(TYPES.Engine).to(ActualEngine);
babylonContainer.bind<Track>(TYPES.Track).to(ActualTrack);
babylonContainer.bind<TrackJoint>(TYPES.TrackJoint).to(ActualTrackJoint);
babylonContainer.bind<TrackSwitch>(TYPES.TrackSwitch).to(ActualTrackSwitch);
babylonContainer.bind<Platform>(TYPES.Platform).to(ActualPlatform);
babylonContainer.bind<Store>(TYPES.Store).to(Store);
babylonContainer
  .bind<TrackJointConnector>(TYPES.TrackJointConnector)
  .to(TrackJointConnector);

let connector: TrackJointConnector = null;
babylonContainer
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
babylonContainer
  .bind<interfaces.Factory<Store>>(TYPES.FactoryOfStore)
  .toFactory<Store>((context: interfaces.Context) => {
    return () => {
      if (!store) {
        store = context.container.get<Store>(TYPES.Store).init();
      }
      return store;
    };
  });

babylonContainer
  .bind<interfaces.Factory<Engine>>(TYPES.FactoryOfEngine)
  .toFactory<Engine>((context: interfaces.Context) => {
    return () => {
      return context.container.get<Engine>(TYPES.Engine);
    };
  });

babylonContainer
  .bind<interfaces.Factory<Track>>(TYPES.FactoryOfTrack)
  .toFactory<Track>((context: interfaces.Context) => {
    return () => {
      return context.container.get<Track>(TYPES.Track);
    };
  });

babylonContainer
  .bind<interfaces.Factory<TrackSwitch>>(TYPES.FactoryOfTrackSwitch)
  .toFactory<TrackSwitch>((context: interfaces.Context) => {
    return () => {
      return context.container.get<TrackSwitch>(TYPES.TrackSwitch);
    };
  });

babylonContainer
  .bind<interfaces.Factory<Platform>>(TYPES.FactoryOfPlatform)
  .toFactory<Platform>((context: interfaces.Context) => {
    return () => {
      return context.container.get<Platform>(TYPES.Platform);
    };
  });
