import { WhichEnd } from './WhichEnd';

export type WhichTrackEnd = WhichEnd | WhichSwitchEnd;

export enum WhichSwitchEnd {
  E = 'E',
  F = 'F'
}
