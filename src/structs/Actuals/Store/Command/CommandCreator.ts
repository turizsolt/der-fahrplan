import { Coordinate } from '../../../Geometry/Coordinate';
import { WhichEnd } from '../../../Interfaces/WhichEnd';
import { WagonConfig } from '../../Wagon/WagonConfig';
import { ProcessableCommand } from './Command';
import { PositionData } from '../../../../modules/Train/PositionData';
import { SpeedPedal } from '../../../../modules/Train/SpeedPedal';

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

  static moveTrain(
    trainId: string,
    posFrom: PositionData,
    posTo: PositionData
  ): ProcessableCommand {
    return {
      type: 'processable',
      function: 'moveTrain',
      params: [trainId, posFrom, posTo]
    };
  }

  static unmoveTrain(
    trainId: string,
    posFrom: PositionData,
    posTo: PositionData
  ): ProcessableCommand {
    return {
      type: 'processable',
      function: 'unmoveTrain',
      params: [trainId, posFrom, posTo]
    };
  }

  static pedalTrain(
    trainId: string,
    pedalFrom: SpeedPedal,
    pedalTo: SpeedPedal
  ): ProcessableCommand {
    return {
      type: 'processable',
      function: 'pedalTrain',
      params: [trainId, pedalFrom, pedalTo]
    };
  }

  static unpedalTrain(
    trainId: string,
    pedalFrom: SpeedPedal,
    pedalTo: SpeedPedal
  ): ProcessableCommand {
    return {
      type: 'processable',
      function: 'unpedalTrain',
      params: [trainId, pedalFrom, pedalTo]
    };
  }

  static mergeTrain(
    train1Id: string,
    train2Id: string,
    wagonId: string
  ): ProcessableCommand {
    return {
      type: 'processable',
      function: 'mergeTrain',
      params: [train1Id, train2Id, wagonId]
    };
  }

  static unmergeTrain(
    train1Id: string,
    train2Id: string,
    wagonId: string
  ): ProcessableCommand {
    return {
      type: 'processable',
      function: 'unmergeTrain',
      params: [train1Id, train2Id, wagonId]
    };
  }

  static reverseTrain(trainId: string): ProcessableCommand {
    return {
      type: 'processable',
      function: 'reverseTrain',
      params: [trainId]
    };
  }

  static unreverseTrain(trainId: string): ProcessableCommand {
    return {
      type: 'processable',
      function: 'unreverseTrain',
      params: [trainId]
    };
  }

  static reverseWagonFacing(wagonId: string): ProcessableCommand {
    return {
      type: 'processable',
      function: 'reverseWagonFacing',
      params: [wagonId]
    };
  }

  static unreverseWagonFacing(wagonId: string): ProcessableCommand {
    return {
      type: 'processable',
      function: 'unreverseWagonFacing',
      params: [wagonId]
    };
  }

  static shuntingTrain(trainId: string): ProcessableCommand {
    return {
      type: 'processable',
      function: 'shuntingTrain',
      params: [trainId]
    };
  }

  static unshuntingTrain(trainId: string): ProcessableCommand {
    return {
      type: 'processable',
      function: 'unshuntingTrain',
      params: [trainId]
    };
  }

  static switchTrack(switchId: string): ProcessableCommand {
    return {
      type: 'processable',
      function: 'switchTrack',
      params: [switchId]
    };
  }

  static unswitchTrack(switchId: string): ProcessableCommand {
    return {
      type: 'processable',
      function: 'unswitchTrack',
      params: [switchId]
    };
  }
}
