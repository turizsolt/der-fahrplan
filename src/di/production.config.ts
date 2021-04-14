import 'reflect-metadata';
import { Container } from 'inversify';
import { PassengerRenderer } from '../structs/Renderers/PassengerRenderer';
import { TYPES as T } from './TYPES';
import { PassengerBabylonRenderer } from '../ui/babylon/PassengerBabylonRenderer';
import { TrackJointRenderer } from '../structs/Renderers/TrackJointRenderer';
import { TrackJointBabylonRenderer } from '../ui/babylon/TrackJointBabylonRenderer';
import { TrackRenderer } from '../structs/Renderers/TrackRenderer';
import { TrackBabylonRenderer } from '../ui/babylon/TrackBabylonRenderer';
import { TrackSwitchRenderer } from '../structs/Renderers/TrackSwitchRenderer';
import { TrackSwitchBabylonRenderer } from '../ui/babylon/TrackSwitchBabylonRenderer';
import { PlatformRenderer } from '../structs/Renderers/PlatformRenderer';
import { PlatformBabylonRenderer } from '../ui/babylon/PlatformBabylonRenderer';
import { WagonRenderer } from '../structs/Renderers/WagonRenderer';
import { WagonBabylonRenderer } from '../ui/babylon/WagonBabylonRenderer';
import { StationRenderer } from '../structs/Renderers/StationRenderer';
import { StationBabylonRenderer } from '../ui/babylon/StationBabylonRenderer';
import { DependencyContainer } from './DependencyContainer';
import { addCommonMaps } from './common';
import { ActualLand } from '../structs/Actuals/ActualLand';
import { Land } from '../structs/Interfaces/Land';
import { MeshProvider } from '../ui/babylon/MeshProvider';
import { SignalRenderer } from '../structs/Renderers/SignalRenderer';
import { SignalBabylonRenderer } from '../ui/babylon/SignalBabylonRenderer';
import { BlockRenderer } from '../structs/Renderers/BlockRenderer';
import { BlockBabylonRenderer } from '../ui/babylon/BlockBabylonRenderer';
import { BlockJointRenderer } from '../structs/Renderers/BlockJointRenderer';
import { BlockJointBabylonRenderer } from '../ui/babylon/BlockJointBabylonRenderer';
import { PathBlockRenderer } from '../structs/Renderers/PathBlockRenderer';
import { PathBlockBabylonRenderer } from '../ui/babylon/PathBlockBabylonRenderer';
import { SectionRenderer } from '../structs/Renderers/SectionRenderer';
import { SectionBabylonRenderer } from '../ui/babylon/SectionBabylonRenderer';

export const productionContainer = new Container();
const ioc = new DependencyContainer(productionContainer);
addCommonMaps(ioc);
ioc.map<Land>(T.Land, ActualLand);
ioc.sng<MeshProvider>(T.FactoryOfMeshProvider, T.MeshProvider, MeshProvider);
ioc.map<TrackRenderer>(T.TrackRenderer, TrackBabylonRenderer);
ioc.map<TrackSwitchRenderer>(T.TrackSwitchRenderer, TrackSwitchBabylonRenderer);
ioc.map<StationRenderer>(T.StationRenderer, StationBabylonRenderer);
ioc.map<PlatformRenderer>(T.PlatformRenderer, PlatformBabylonRenderer);
ioc.map<PassengerRenderer>(T.PassengerRenderer, PassengerBabylonRenderer);

ioc.fm<TrackJointRenderer>(
  T.FactoryOfTrackJointRenderer,
  T.TrackJointRenderer,
  TrackJointBabylonRenderer
);
ioc.fm<WagonRenderer>(
  T.FactoryOfWagonRenderer,
  T.WagonRenderer,
  WagonBabylonRenderer
);
ioc.fm<SignalRenderer>(
  T.FactoryOfSignalRenderer,
  T.SignalRenderer,
  SignalBabylonRenderer
);
ioc.fm<BlockRenderer>(
  T.FactoryOfBlockRenderer,
  T.BlockRenderer,
  BlockBabylonRenderer
);
ioc.fm<BlockJointRenderer>(
  T.FactoryOfBlockJointRenderer,
  T.BlockJointRenderer,
  BlockJointBabylonRenderer
);
ioc.fm<PathBlockRenderer>(
  T.FactoryOfPathBlockRenderer,
  T.PathBlockRenderer,
  PathBlockBabylonRenderer
);
ioc.fm<SectionRenderer>(
  T.FactoryOfSectionRenderer,
  T.SectionRenderer,
  SectionBabylonRenderer
);
