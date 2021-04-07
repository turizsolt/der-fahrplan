import { Coordinate } from '../../../Geometry/Coordinate';
import { WhichEnd } from '../../../Interfaces/WhichEnd';
import { WagonConfig } from '../../Wagon/WagonConfig';
import { ProcessableCommand } from './Command';

export class CommandCreator {
  static createTrackJoint(id, x, z, angle): ProcessableCommand {
    return {
      type: 'processable',
      function: 'createTrackJoint',
      params: [id, x, z, angle]
    };
  }

  static joinTrackJoints(
    trackId: string,
    coordinates: Coordinate[],
    jointId1: string,
    whichEnd1: WhichEnd,
    jointId2,
    whichEnd2: WhichEnd
  ): ProcessableCommand {
    return {
      type: 'processable',
      function: 'joinTrackJoints',
      params: [trackId, coordinates, jointId1, whichEnd1, jointId2, whichEnd2]
    };
  }

  static unjoinTrackJoints(
    trackId: string,
    coordinates: Coordinate[],
    jointId1: string,
    whichEnd1: WhichEnd,
    jointId2,
    whichEnd2: WhichEnd
  ): ProcessableCommand {
    return {
      type: 'processable',
      function: 'unjoinTrackJoints',
      params: [trackId, coordinates, jointId1, whichEnd1, jointId2, whichEnd2]
    };
  }

  static joinTrackJoints3(
    trackId: string,
    oldCoordinates: Coordinate[],
    coordinates: Coordinate[],
    jointId1: string,
    whichEnd1: WhichEnd,
    jointId2,
    whichEnd2: WhichEnd,
    jointId3,
    whichEnd3: WhichEnd
  ): ProcessableCommand {
    return {
      type: 'processable',
      function: 'joinTrackJoints3',
      params: [
        trackId,
        oldCoordinates,
        coordinates,
        jointId1,
        whichEnd1,
        jointId2,
        whichEnd2,
        jointId3,
        whichEnd3
      ]
    };
  }

  static createTrain(
    wagonId: string,
    trainId: string,
    wagonConfig: WagonConfig,
    trackId: string,
    position: number,
    direction: number
  ): ProcessableCommand {
    return {
      type: 'processable',
      function: 'createTrain',
      params: [wagonId, trainId, wagonConfig, trackId, position, direction]
    };
  }

  static uncreateTrain(
    wagonId: string,
    trainId: string,
    wagonConfig: WagonConfig,
    trackId: string,
    position: number,
    direction: number
  ): ProcessableCommand {
    return {
      type: 'processable',
      function: 'uncreateTrain',
      params: [wagonId, trainId, wagonConfig, trackId, position, direction]
    };
  }
}
