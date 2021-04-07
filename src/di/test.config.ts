import 'reflect-metadata';
import { Container } from 'inversify';
import { PassengerRenderer } from '../structs/Renderers/PassengerRenderer';
import { TYPES as T } from '../di/TYPES';
import { PassengerDummyRenderer } from '../../test/dummies/PassengerDummyRenderer';
import { TrackJointRenderer } from '../structs/Renderers/TrackJointRenderer';
import { TrackJointDummyRenderer } from '../../test/dummies/TrackJointDummyRenderer';
import { TrackRenderer } from '../structs/Renderers/TrackRenderer';
import { TrackDummyRenderer } from '../../test/dummies/TrackDummyRenderer';
import { TrackSwitchRenderer } from '../structs/Renderers/TrackSwitchRenderer';
import { TrackSwitchDummyRenderer } from '../../test/dummies/TrackSwitchDummyRenderer';
import { PlatformRenderer } from '../structs/Renderers/PlatformRenderer';
import { PlatformDummyRenderer } from '../../test/dummies/PlatformDummyRenderer';
import { WagonRenderer } from '../structs/Renderers/WagonRenderer';
import { WagonDummyRenderer } from '../../test/dummies/WagonDummyRenderer';
import { StationRenderer } from '../structs/Renderers/StationRenderer';
import { StationDummyRenderer } from '../../test/dummies/StationDummyRenderer';
import { addCommonMaps } from './common';
import { DependencyContainer } from './DependencyContainer';

export const testContainer = new Container();
const ioc = new DependencyContainer(testContainer);
addCommonMaps(ioc);
ioc.map<TrackRenderer>(T.TrackRenderer, TrackDummyRenderer);
ioc.map<TrackSwitchRenderer>(T.TrackSwitchRenderer, TrackSwitchDummyRenderer);
ioc.map<StationRenderer>(T.StationRenderer, StationDummyRenderer);
ioc.map<PlatformRenderer>(T.PlatformRenderer, PlatformDummyRenderer);
ioc.map<PassengerRenderer>(T.PassengerRenderer, PassengerDummyRenderer);

ioc.fm<TrackJointRenderer>(
  T.FactoryOfTrackJointRenderer,
  T.TrackJointRenderer,
  TrackJointDummyRenderer
);
ioc.fm<WagonRenderer>(
  T.FactoryOfWagonRenderer,
  T.WagonRenderer,
  WagonDummyRenderer
);
