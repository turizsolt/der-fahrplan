import { Coordinate } from "../../../Geometry/Coordinate";
import { WhichEnd } from "../../../Interfaces/WhichEnd";
import { ProcessableCommand } from "./Command";

export class CommandCreator {
  static createTrackJoint(id, x, z, angle): ProcessableCommand {
    return {
      type: 'processable',
      function: 'createTrackJoint',
      params: [id, x, z, angle],
    };
  }

  static joinTrackJoints(trackId: string, coordinates: Coordinate[], jointId1: string, whichEnd1: WhichEnd, jointId2, whichEnd2: WhichEnd): ProcessableCommand {
    return {
      type: 'processable',
      function: 'joinTrackJoints',
      params: [trackId, coordinates, jointId1, whichEnd1, jointId2, whichEnd2],
    }
  }
}
