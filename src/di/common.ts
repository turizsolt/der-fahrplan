import { TYPES as T } from './TYPES';
import { Track } from '../structs/Interfaces/Track';
import { TrackSwitch } from '../structs/Interfaces/TrackSwitch';
import { ActualTrack } from '../structs/Actuals/Track/ActualTrack';
import { ActualTrackSwitch } from '../structs/Actuals/Track/ActualTrackSwitch';
import { TrackJoint } from '../structs/Interfaces/TrackJoint';
import { ActualTrackJoint } from '../structs/Actuals/TrackJoint/ActualTrackJoint';
import { ActualStore } from '../structs/Actuals/Store/ActualStore';
import { Platform } from '../structs/Interfaces/Platform';
import { ActualPlatform } from '../structs/Actuals/ActualPlatform';
import { TrackJointConnector } from '../structs/Actuals/TrackJoint/TrackJointConnector';
import { ActualWagon } from '../structs/Actuals/Wagon/ActualWagon';
import { Wagon } from '../structs/Interfaces/Wagon';
import { RouteStop } from '../structs/Scheduling/RouteStop';
import { ActualRouteStop } from '../structs/Scheduling/ActualRouteStop';
import { Route } from '../structs/Scheduling/Route';
import { ActualRoute } from '../structs/Scheduling/ActualRoute';
import { Station } from '../structs/Scheduling/Station';
import { ActualStation } from '../structs/Scheduling/ActualStation';
import { Store } from '../structs/Interfaces/Store';
import { Passenger } from '../structs/Interfaces/Passenger';
import { ActualPassenger } from '../structs/Actuals/ActualPassenger';
import { PassengerGenerator } from '../structs/Actuals/PassengerGenerator';
import { ActualPassengerGenerator } from '../structs/Actuals/ActualPassengerGenerator';
import { DependencyContainer } from './DependencyContainer';
import { Train } from '../structs/Scheduling/Train';
import { ActualTrain } from '../structs/Scheduling/ActualTrain';
import { Trip } from '../structs/Scheduling/Trip';
import { ActualTrip } from '../structs/Scheduling/ActualTrip';

export const addCommonMaps = (ioc: DependencyContainer): void => {
  ioc.sng<Store>(T.FactoryOfStore, T.Store, ActualStore);
  ioc.sng<TrackJointConnector>(
    T.FactoryOfTrackJointConnector,
    T.TrackJointConnector,
    TrackJointConnector
  );

  ioc.fm<PassengerGenerator>(T.FactoryOfPassengerGenerator, T.PassengerGenerator, ActualPassengerGenerator);
  ioc.fm<Train>(T.FactoryOfTrain, T.Train, ActualTrain);
  ioc.fm<Wagon>(T.FactoryOfWagon, T.Wagon, ActualWagon);
  ioc.fm<Track>(T.FactoryOfTrack, T.Track, ActualTrack);
  ioc.fm<TrackSwitch>(T.FactoryOfTrackSwitch, T.TrackSwitch, ActualTrackSwitch);
  ioc.fm<TrackJoint>(T.FactoryOfTrackJoint, T.TrackJoint, ActualTrackJoint);
  ioc.fm<Station>(T.FactoryOfStation, T.Station, ActualStation);
  ioc.fm<Platform>(T.FactoryOfPlatform, T.Platform, ActualPlatform);
  ioc.fm<Passenger>(T.FactoryOfPassenger, T.Passenger, ActualPassenger);
  ioc.fm<Route>(T.FactoryOfRoute, T.Route, ActualRoute);
  ioc.fm<RouteStop>(T.FactoryOfRouteStop, T.RouteStop, ActualRouteStop);
  ioc.fm<Trip>(T.FactoryOfTrip, T.Trip, ActualTrip);
};
