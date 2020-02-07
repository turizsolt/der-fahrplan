import 'reflect-metadata';
import { Container } from 'inversify';
import { PassengerRenderer } from './Passenger/PassengerRenderer';
import { TYPES } from './TYPES';
import { PassengerBabylonRenderer } from './Passenger/PassengerBabylonRenderer';
import { EngineBabylonRenderer } from './Engine/EngineBabylonRenderer';
import { EngineRenderer } from './Engine/EngineRenderer';

export const babylonContainer = new Container();
babylonContainer
  .bind<PassengerRenderer>(TYPES.PassengerRenderer)
  .to(PassengerBabylonRenderer);
babylonContainer
  .bind<EngineRenderer>(TYPES.EngineRenderer)
  .to(EngineBabylonRenderer);
