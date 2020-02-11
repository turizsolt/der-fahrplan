import 'reflect-metadata';
import { Container } from 'inversify';
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
