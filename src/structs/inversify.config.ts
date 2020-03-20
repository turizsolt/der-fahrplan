import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import { PassengerRenderer } from './Renderers/PassengerRenderer';
import { TYPES } from './TYPES';
import { PassengerBabylonRenderer } from '../ui/babylon/PassengerBabylonRenderer';
import { EngineBabylonRenderer } from '../ui/babylon/EngineBabylonRenderer';
import { EngineRenderer } from './Renderers/EngineRenderer';
import { TrackJointRenderer } from './Renderers/TrackJointRenderer';
import { TrackJointBabylonRenderer } from '../ui/babylon/TrackJointBabylonRenderer';
import { TrackRenderer } from './Renderers/TrackRenderer';
import { TrackBabylonRenderer } from '../ui/babylon/TrackBabylonRenderer';
import { TrackSwitchRenderer } from './Renderers/TrackSwitchRenderer';
import { TrackSwitchBabylonRenderer } from '../ui/babylon/TrackSwitchBabylonRenderer';
import { Land } from './Interfaces/Land';
import { ActualLand } from './Actuals/ActualLand';
import { Engine } from './Interfaces/Engine';
import { ActualEngine } from './Actuals/Wagon/ActualEngine';
import { Track } from './Interfaces/Track';
import { TrackSwitch } from './Interfaces/TrackSwitch';
import { ActualTrack } from './Actuals/Track/ActualTrack';
import { ActualTrackSwitch } from './Actuals/Track/ActualTrackSwitch';
import { TrackJoint } from './Interfaces/TrackJoint';
import { ActualTrackJoint } from './Actuals/TrackJoint/ActualTrackJoint';
import { Store } from './Actuals/Store/Store';
import { PlatformRenderer } from './Renderers/PlatformRenderer';
import { PlatformBabylonRenderer } from '../ui/babylon/PlatformBabylonRenderer';
import { Platform } from './Interfaces/Platform';
import { ActualPlatform } from './Actuals/ActualPlatform';
import { TrackJointConnector } from './Actuals/TrackJoint/TrackJointConnector';
import { MeshProvider } from '../ui/babylon/MeshProvider';
import { ActualWagon } from './Actuals/Wagon/ActualWagon';
import { Wagon } from './Interfaces/Wagon';
import { WagonRenderer } from './Renderers/WagonRenderer';
import { WagonBabylonRenderer } from '../ui/babylon/WagonBabylonRenderer';

export const babylonContainer = new Container();
babylonContainer
  .bind<PassengerRenderer>(TYPES.PassengerRenderer)
  .to(PassengerBabylonRenderer);
babylonContainer
  .bind<EngineRenderer>(TYPES.EngineRenderer)
  .to(EngineBabylonRenderer);
babylonContainer
  .bind<WagonRenderer>(TYPES.WagonRenderer)
  .to(WagonBabylonRenderer);
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
babylonContainer.bind<Wagon>(TYPES.Wagon).to(ActualWagon);
babylonContainer.bind<Track>(TYPES.Track).to(ActualTrack);
babylonContainer.bind<TrackJoint>(TYPES.TrackJoint).to(ActualTrackJoint);
babylonContainer.bind<TrackSwitch>(TYPES.TrackSwitch).to(ActualTrackSwitch);
babylonContainer.bind<Platform>(TYPES.Platform).to(ActualPlatform);
babylonContainer.bind<Store>(TYPES.Store).to(Store);
babylonContainer.bind<MeshProvider>(TYPES.MeshProvider).to(MeshProvider);
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

let meshProvider: MeshProvider = null;
babylonContainer
  .bind<interfaces.Factory<MeshProvider>>(TYPES.FactoryOfMeshProvider)
  .toFactory<MeshProvider>((context: interfaces.Context) => {
    return () => {
      if (!meshProvider) {
        meshProvider = context.container.get<MeshProvider>(TYPES.MeshProvider);
      }
      return meshProvider;
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
  .bind<interfaces.Factory<Wagon>>(TYPES.FactoryOfWagon)
  .toFactory<Wagon>((context: interfaces.Context) => {
    return () => {
      return context.container.get<Wagon>(TYPES.Wagon);
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
