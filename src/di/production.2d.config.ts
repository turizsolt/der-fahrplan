import 'reflect-metadata';
import { Container } from 'inversify';
import { PassengerRenderer } from '../structs/Renderers/PassengerRenderer';
import { TYPES as T } from './TYPES';
import { PassengerDummyRenderer } from '../../test/dummies/PassengerDummyRenderer';
import { TrackJointRenderer } from '../structs/Renderers/TrackJointRenderer';
import { TrackRenderer } from '../structs/Renderers/TrackRenderer';
import { TrackSwitchRenderer } from '../structs/Renderers/TrackSwitchRenderer';
import { PlatformRenderer } from '../structs/Renderers/PlatformRenderer';
import { WagonRenderer } from '../structs/Renderers/WagonRenderer';
import { StationRenderer } from '../structs/Renderers/StationRenderer';
import { addCommonMaps } from './common';
import { DependencyContainer } from './DependencyContainer';
import { SignalRenderer } from '../structs/Renderers/SignalRenderer';
import { SignalDummyRenderer } from '../../test/dummies/SignalDummyRenderer';
import { BlockRenderer } from '../structs/Renderers/BlockRenderer';
import { BlockDummyRenderer } from '../../test/dummies/BlockDummyRenderer';
import { BlockJointRenderer } from '../structs/Renderers/BlockJointRenderer';
import { PathBlockRenderer } from '../structs/Renderers/PathBlockRenderer';
import { PathBlockDummyRenderer } from '../../test/dummies/PathBlockDummyRenderer';
import { SectionRenderer } from '../structs/Renderers/SectionRenderer';
import { SectionDummyRenderer } from '../../test/dummies/SectionDummyRenderer';
import { SensorRenderer } from '../structs/Renderers/SensorRenderer';
import { SensorDummyRenderer } from '../../test/dummies/SensorDummyRenderer';
import { TrackPixiRenderer } from '../ui/babylon/TrackPixiRenderer';
import { ActualLand } from '../structs/Actuals/ActualLand';
import { Land } from '../structs/Interfaces/Land';
import { TrackJointPixiRenderer } from '../ui/babylon/TrackJointPixiRenderer';
import { TrackSwitchPixiRenderer } from '../ui/babylon/TrackSwitchPixiRenderer';
import { WagonPixiRenderer } from '../ui/babylon/WagonPixiRenderer';
import { PlatformPixiRenderer } from '../ui/babylon/PlatformPixiRenderer';
import { StationPixiRenderer } from '../ui/babylon/StationPixiRenderer';
import { BlockJointPixiRenderer } from '../ui/babylon/BlockJointPixiRenderer';

export const productionContainer2d = new Container();
const ioc = new DependencyContainer(productionContainer2d);
addCommonMaps(ioc);
ioc.map<Land>(T.Land, ActualLand);
ioc.map<TrackRenderer>(T.TrackRenderer, TrackPixiRenderer);
ioc.map<TrackSwitchRenderer>(T.TrackSwitchRenderer, TrackSwitchPixiRenderer);
ioc.map<StationRenderer>(T.StationRenderer, StationPixiRenderer);
ioc.map<PlatformRenderer>(T.PlatformRenderer, PlatformPixiRenderer);
ioc.map<PassengerRenderer>(T.PassengerRenderer, PassengerDummyRenderer);

ioc.fm<TrackJointRenderer>(
  T.FactoryOfTrackJointRenderer,
  T.TrackJointRenderer,
  TrackJointPixiRenderer
);
ioc.fm<WagonRenderer>(
  T.FactoryOfWagonRenderer,
  T.WagonRenderer,
  WagonPixiRenderer
);
ioc.fm<SignalRenderer>(
  T.FactoryOfSignalRenderer,
  T.SignalRenderer,
  SignalDummyRenderer
);
ioc.fm<SensorRenderer>(
  T.FactoryOfSensorRenderer,
  T.SensorRenderer,
  SensorDummyRenderer
);
ioc.fm<BlockRenderer>(
  T.FactoryOfBlockRenderer,
  T.BlockRenderer,
  BlockDummyRenderer
);
ioc.fm<BlockJointRenderer>(
  T.FactoryOfBlockJointRenderer,
  T.BlockJointRenderer,
  BlockJointPixiRenderer
);
ioc.fm<PathBlockRenderer>(
  T.FactoryOfPathBlockRenderer,
  T.PathBlockRenderer,
  PathBlockDummyRenderer
);
ioc.fm<SectionRenderer>(
  T.FactoryOfSectionRenderer,
  T.SectionRenderer,
  SectionDummyRenderer
);
