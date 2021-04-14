import { TYPES as T } from './TYPES';
import { Track } from '../modules/Track/Track';
import { TrackSwitch } from '../modules/Track/TrackSwitch';
import { ActualTrack } from '../modules/Track/ActualTrack';
import { ActualTrackSwitch } from '../modules/Track/ActualTrackSwitch';
import { TrackJoint } from '../modules/Track/TrackJoint/TrackJoint';
import { ActualTrackJoint } from '../modules/Track/TrackJoint/ActualTrackJoint';
import { ActualStore } from '../structs/Actuals/Store/ActualStore';
import { Platform } from '../structs/Interfaces/Platform';
import { ActualPlatform } from '../structs/Actuals/ActualPlatform';
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
import { Trip } from '../structs/Scheduling/Trip';
import { ActualTrip } from '../structs/Scheduling/ActualTrip';
import { Train } from '../modules/Train/Train';
import { ActualTrain } from '../modules/Train/ActualTrain';
import { Signal } from '../modules/Signaling/Signal';
import { ActualSignal } from '../modules/Signaling/ActualSignal';
import { Block } from '../modules/Signaling/Block';
import { BlockJoint } from '../modules/Signaling/BlockJoint';
import { PathBlock } from '../modules/Signaling/PathBlock';
import { Segment } from '../modules/Signaling/Segment';
import { ActualBlock } from '../modules/Signaling/ActualBlock';
import { ActualBlockJoint } from '../modules/Signaling/ActualBlockJoint';
import { ActualPathBlock } from '../modules/Signaling/ActualPathBlock';
import { ActualSegment } from '../modules/Signaling/ActualSegment';

export const addCommonMaps = (ioc: DependencyContainer): void => {
  ioc.sng<Store>(T.FactoryOfStore, T.Store, ActualStore);

  ioc.fm<PassengerGenerator>(
    T.FactoryOfPassengerGenerator,
    T.PassengerGenerator,
    ActualPassengerGenerator
  );
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
  ioc.fm<Signal>(T.FactoryOfSignal, T.Signal, ActualSignal);
  ioc.fm<Block>(T.FactoryOfBlock, T.Block, ActualBlock);
  ioc.fm<BlockJoint>(T.FactoryOfBlockJoint, T.BlockJoint, ActualBlockJoint);
  ioc.fm<PathBlock>(T.FactoryOfPathBlock, T.PathBlock, ActualPathBlock);
  ioc.fm<Segment>(T.FactoryOfSegment, T.Segment, ActualSegment);
};
