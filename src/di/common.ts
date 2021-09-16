import { TYPES as T } from './TYPES';
import { Track } from '../modules/Track/Track';
import { TrackSwitch } from '../modules/Track/TrackSwitch';
import { ActualTrack } from '../modules/Track/ActualTrack';
import { ActualTrackSwitch } from '../modules/Track/ActualTrackSwitch';
import { TrackJoint } from '../modules/Track/TrackJoint/TrackJoint';
import { ActualTrackJoint } from '../modules/Track/TrackJoint/ActualTrackJoint';
import { ActualStore } from '../structs/Actuals/Store/ActualStore';
import { Platform } from '../modules/Station/Platform';
import { ActualPlatform } from '../modules/Station/ActualPlatform';
import { ActualWagon } from '../structs/Actuals/Wagon/ActualWagon';
import { Wagon } from '../structs/Interfaces/Wagon';
import { RouteStop } from '../structs/Scheduling/RouteStop';
import { ActualRouteStop } from '../structs/Scheduling/ActualRouteStop';
import { Route } from '../structs/Scheduling/Route';
import { ActualRoute } from '../structs/Scheduling/ActualRoute';
import { Station } from '../modules/Station/Station';
import { ActualStation } from '../modules/Station/ActualStation';
import { Store } from '../structs/Interfaces/Store';
import { Passenger } from '../modules/Passenger/Passenger';
import { ActualPassenger } from '../modules/Passenger/ActualPassenger';
import { PassengerGenerator } from '../modules/Passenger/PassengerGenerator';
import { ActualPassengerGenerator } from '../modules/Passenger/ActualPassengerGenerator';
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
import { Section } from '../modules/Signaling/Section';
import { ActualBlock } from '../modules/Signaling/ActualBlock';
import { ActualBlockJoint } from '../modules/Signaling/ActualBlockJoint';
import { ActualPathBlock } from '../modules/Signaling/ActualPathBlock';
import { ActualSection } from '../modules/Signaling/ActualSection';
import { Sensor } from '../modules/Signaling/Sensor';
import { ActualSensor } from '../modules/Signaling/ActualSensor';
import { CapacityCap } from '../modules/Signaling/CapacityCap/CapacityCap';
import { ActualCapacityCap } from '../modules/Signaling/CapacityCap/ActualCapacityCap';
import { TripGroup } from '../structs/Scheduling/TripGroup';
import { ActualTripGroup } from '../structs/Scheduling/ActualTripGroup';
import { WaitingHall } from '../modules/Station/WaitingHall';
import { ActualWaitingHall } from '../modules/Station/ActualWaitingHall';

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
    ioc.fm<WaitingHall>(T.FactoryOfWaitingHall, T.WaitingHall, ActualWaitingHall);
    ioc.fm<Passenger>(T.FactoryOfPassenger, T.Passenger, ActualPassenger);
    ioc.fm<Route>(T.FactoryOfRoute, T.Route, ActualRoute);
    ioc.fm<RouteStop>(T.FactoryOfRouteStop, T.RouteStop, ActualRouteStop);
    ioc.fm<Trip>(T.FactoryOfTrip, T.Trip, ActualTrip);
    ioc.fm<TripGroup>(T.FactoryOfTripGroup, T.TripGroup, ActualTripGroup);
    ioc.fm<Signal>(T.FactoryOfSignal, T.Signal, ActualSignal);
    ioc.fm<Sensor>(T.FactoryOfSensor, T.Sensor, ActualSensor);
    ioc.fm<Block>(T.FactoryOfBlock, T.Block, ActualBlock);
    ioc.fm<BlockJoint>(T.FactoryOfBlockJoint, T.BlockJoint, ActualBlockJoint);
    ioc.fm<PathBlock>(T.FactoryOfPathBlock, T.PathBlock, ActualPathBlock);
    ioc.fm<Section>(T.FactoryOfSection, T.Section, ActualSection);
    ioc.fm<CapacityCap>(T.FactoryOfCapacityCap, T.CapacityCap, ActualCapacityCap);
};
