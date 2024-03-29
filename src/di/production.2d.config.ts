import 'reflect-metadata';
import { Container } from 'inversify';
import { PassengerRenderer } from '../structs/Renderers/PassengerRenderer';
import { TYPES as T } from './TYPES';
import { TrackJointRenderer } from '../structs/Renderers/TrackJointRenderer';
import { TrackRenderer } from '../structs/Renderers/TrackRenderer';
import { TrackSwitchRenderer } from '../structs/Renderers/TrackSwitchRenderer';
import { PlatformRenderer } from '../structs/Renderers/PlatformRenderer';
import { WagonRenderer } from '../structs/Renderers/WagonRenderer';
import { StationRenderer } from '../structs/Renderers/StationRenderer';
import { addCommonMaps } from './common';
import { DependencyContainer } from './DependencyContainer';
import { SignalRenderer } from '../structs/Renderers/SignalRenderer';
import { BlockRenderer } from '../structs/Renderers/BlockRenderer';
import { BlockJointRenderer } from '../structs/Renderers/BlockJointRenderer';
import { PathBlockRenderer } from '../structs/Renderers/PathBlockRenderer';
import { SectionRenderer } from '../structs/Renderers/SectionRenderer';
import { SensorRenderer } from '../structs/Renderers/SensorRenderer';
import { TrackPixiRenderer } from '../ui/babylon/TrackPixiRenderer';
import { ActualLand } from '../structs/Actuals/ActualLand';
import { Land } from '../structs/Interfaces/Land';
import { TrackJointPixiRenderer } from '../ui/babylon/TrackJointPixiRenderer';
import { TrackSwitchPixiRenderer } from '../ui/babylon/TrackSwitchPixiRenderer';
import { WagonPixiRenderer } from '../ui/babylon/WagonPixiRenderer';
import { PlatformPixiRenderer } from '../ui/babylon/PlatformPixiRenderer';
import { StationPixiRenderer } from '../ui/babylon/StationPixiRenderer';
import { BlockJointPixiRenderer } from '../ui/babylon/BlockJointPixiRenderer';
import { BlockPixiRenderer } from '../ui/babylon/BlockPixiRenderer';
import { SectionPixiRenderer } from '../ui/babylon/SectionPixiRenderer';
import { SignalPixiRenderer } from '../ui/babylon/SignalPixiRenderer';
import { PathBlockPixiRenderer } from '../ui/babylon/PathBlockPixiRenderer';
import { CapacityCapRenderer } from '../structs/Renderers/CapacityCapRenderer';
import { CapacityCapPixiRenderer } from '../ui/babylon/CapacityCapPixiRenderer';
import { PassengerPixiRenderer } from '../ui/babylon/PassengerPixiRenderer';
import { WaitingHallRenderer } from '../structs/Renderers/WaitingHallRenderer';
import { WaitingHallPixiRenderer } from '../ui/babylon/WaitingHallPixiRenderer';
import { SensorPixiRenderer } from '../ui/babylon/SensorPixiRenderer';

export const productionContainer2d = new Container();
const ioc = new DependencyContainer(productionContainer2d);
addCommonMaps(ioc);
ioc.map<Land>(T.Land, ActualLand);
ioc.map<TrackRenderer>(T.TrackRenderer, TrackPixiRenderer);
ioc.map<TrackSwitchRenderer>(T.TrackSwitchRenderer, TrackSwitchPixiRenderer);
ioc.map<PlatformRenderer>(T.PlatformRenderer, PlatformPixiRenderer);
ioc.map<PassengerRenderer>(T.PassengerRenderer, PassengerPixiRenderer);

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
    SignalPixiRenderer
);
ioc.fm<SensorRenderer>(
    T.FactoryOfSensorRenderer,
    T.SensorRenderer,
    SensorPixiRenderer
);
ioc.fm<WaitingHallRenderer>(
    T.FactoryOfWaitingHallRenderer,
    T.WaitingHallRenderer,
    WaitingHallPixiRenderer
);
ioc.fm<BlockRenderer>(
    T.FactoryOfBlockRenderer,
    T.BlockRenderer,
    BlockPixiRenderer
);
ioc.fm<BlockJointRenderer>(
    T.FactoryOfBlockJointRenderer,
    T.BlockJointRenderer,
    BlockJointPixiRenderer
);
ioc.fm<PathBlockRenderer>(
    T.FactoryOfPathBlockRenderer,
    T.PathBlockRenderer,
    PathBlockPixiRenderer
);
ioc.fm<SectionRenderer>(
    T.FactoryOfSectionRenderer,
    T.SectionRenderer,
    SectionPixiRenderer
);
ioc.fm<CapacityCapRenderer>(
    T.FactoryOfCapacityCapRenderer,
    T.CapacityCapRenderer,
    CapacityCapPixiRenderer
);
ioc.fm<StationRenderer>(
    T.FactoryOfStationRenderer,
    T.StationRenderer,
    StationPixiRenderer
);

