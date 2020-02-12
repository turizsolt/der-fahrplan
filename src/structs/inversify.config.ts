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
import { SwitchRenderer } from './TrackSwitch/SwitchRenderer';
import { SwitchBabylonRenderer } from './TrackSwitch/SwitchBabylonRenderer';
import { Land } from './Land/Land';
import { ActualLand } from './Land/ActualLand';
import { Engine } from './Engine/Engine';
import { ActualEngine } from './Engine/ActualEngine';

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
  .bind<SwitchRenderer>(TYPES.SwitchRenderer)
  .to(SwitchBabylonRenderer);
babylonContainer.bind<Land>(TYPES.Land).to(ActualLand);
babylonContainer.bind<Engine>(TYPES.Engine).to(ActualEngine);

babylonContainer
  .bind<interfaces.Factory<Engine>>(TYPES.FactoryOfEngine)
  .toFactory<Engine>((context: interfaces.Context) => {
    return () => {
      return context.container.get<Engine>(TYPES.Engine);
    };
  });
