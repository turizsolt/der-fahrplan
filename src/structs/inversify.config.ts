import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import { PassengerRenderer } from './Renderers/PassengerRenderer';
import { TYPES } from './TYPES';
import { PassengerBabylonRenderer } from '../ui/babylon/PassengerBabylonRenderer';
import { TrackJointRenderer } from './Renderers/TrackJointRenderer';
import { TrackJointBabylonRenderer } from '../ui/babylon/TrackJointBabylonRenderer';
import { TrackRenderer } from './Renderers/TrackRenderer';
import { TrackBabylonRenderer } from '../ui/babylon/TrackBabylonRenderer';
import { TrackSwitchRenderer } from './Renderers/TrackSwitchRenderer';
import { TrackSwitchBabylonRenderer } from '../ui/babylon/TrackSwitchBabylonRenderer';
import { Land } from './Interfaces/Land';
import { ActualLand } from './Actuals/ActualLand';
import { Track } from './Interfaces/Track';
import { TrackSwitch } from './Interfaces/TrackSwitch';
import { ActualTrack } from './Actuals/Track/ActualTrack';
import { ActualTrackSwitch } from './Actuals/Track/ActualTrackSwitch';
import { TrackJoint } from './Interfaces/TrackJoint';
import { ActualTrackJoint } from './Actuals/TrackJoint/ActualTrackJoint';
import { ActualStore } from './Actuals/Store/ActualStore';
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
import { RouteStop } from './Scheduling/RouteStop';
import { ActualRouteStop } from './Scheduling/ActualRouteStop';
import { Route } from './Scheduling/Route';
import { ActualRoute } from './Scheduling/ActualRoute';
import { Station } from './Scheduling/Station';
import { StationRenderer } from './Renderers/StationRenderer';
import { ActualStation } from './Scheduling/ActualStation';
import { Store } from './Interfaces/Store';
import { StationBabylonRenderer } from '../ui/babylon/StationBabylonRenderer';
import { Passenger } from './Interfaces/Passenger';
import { ActualPassenger } from './Actuals/ActualPassenger';
import { PassengerGenerator } from './Actuals/PassengerGenerator';
import { ActualPassengerGenerator } from './Actuals/ActualPassengerGenerator';

export const babylonContainer = new Container();
babylonContainer
  .bind<PassengerRenderer>(TYPES.PassengerRenderer)
  .to(PassengerBabylonRenderer);
babylonContainer
  .bind<PassengerGenerator>(TYPES.PassengerGenerator)
  .to(ActualPassengerGenerator);
babylonContainer.bind<Passenger>(TYPES.Passenger).to(ActualPassenger);
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
babylonContainer.bind<Wagon>(TYPES.Wagon).to(ActualWagon);
babylonContainer.bind<Track>(TYPES.Track).to(ActualTrack);
babylonContainer.bind<TrackJoint>(TYPES.TrackJoint).to(ActualTrackJoint);
babylonContainer.bind<TrackSwitch>(TYPES.TrackSwitch).to(ActualTrackSwitch);
babylonContainer.bind<Platform>(TYPES.Platform).to(ActualPlatform);
babylonContainer.bind<Store>(TYPES.Store).to(ActualStore);
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

babylonContainer.bind<Station>(TYPES.Station).to(ActualStation);
babylonContainer
  .bind<StationRenderer>(TYPES.StationRenderer)
  .to(StationBabylonRenderer);
babylonContainer
  .bind<interfaces.Factory<Station>>(TYPES.FactoryOfStation)
  .toFactory<Station>((context: interfaces.Context) => {
    return () => {
      return context.container.get<Station>(TYPES.Station);
    };
  });

babylonContainer.bind<Route>(TYPES.Route).to(ActualRoute);
babylonContainer
  .bind<interfaces.Factory<Route>>(TYPES.FactoryOfRoute)
  .toFactory<Route>((context: interfaces.Context) => {
    return () => {
      return context.container.get<Route>(TYPES.Route);
    };
  });

babylonContainer.bind<RouteStop>(TYPES.RouteStop).to(ActualRouteStop);
babylonContainer
  .bind<interfaces.Factory<RouteStop>>(TYPES.FactoryOfRouteStop)
  .toFactory<RouteStop>((context: interfaces.Context) => {
    return () => {
      return context.container.get<RouteStop>(TYPES.RouteStop);
    };
  });
babylonContainer
  .bind<interfaces.Factory<TrackJoint>>(TYPES.FactoryOfTrackJoint)
  .toFactory<TrackJoint>((context: interfaces.Context) => {
    return () => {
      return context.container.get<TrackJoint>(TYPES.TrackJoint);
    };
  });

babylonContainer
  .bind<interfaces.Factory<Passenger>>(TYPES.FactoryOfPassenger)
  .toFactory<Passenger>((context: interfaces.Context) => {
    return () => {
      return context.container.get<Passenger>(TYPES.Passenger);
    };
  });
