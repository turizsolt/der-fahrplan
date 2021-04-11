import { TYPES } from '../../../../di/TYPES';
import { Coordinate } from '../../../Geometry/Coordinate';
import { Store } from '../../../Interfaces/Store';
import { Track } from '../../../../modules/Track/Track';
import { TrackBase } from '../../../../modules/Track/TrackBase';
import { TrackJoint } from '../../../../modules/Track/TrackJoint/TrackJoint';
import { TrackSwitch } from '../../../../modules/Track/TrackSwitch';
import { Wagon } from '../../../Interfaces/Wagon';
import { WhichEnd } from '../../../Interfaces/WhichEnd';
import { WagonConfig } from '../../Wagon/WagonConfig';
import { CommandLog } from './CommandLog';
import { Ray } from '../../../Geometry/Ray';
import { Train } from '../../../../modules/Train/Train';
import { TrackDirection } from '../../../../modules/Track/TrackDirection';
import { PositionOnTrack } from '../../../../modules/Train/PositionOnTrack';
import { PositionData } from '../../../../modules/Train/PositionData';
import { SpeedPedal } from '../../../../modules/Train/SpeedPedal';

export class CommandProcessor {
  constructor(private store: Store, private logStore: CommandLog) {}

  createTrackJoint(
    id: string,
    x: number,
    z: number,
    angle: number
  ): TrackJoint {
    const j2 = this.store.create<TrackJoint>(TYPES.TrackJoint);
    j2.presetId(id);
    j2.init(Ray.from(x, 0, z, angle));
    return j2;
  }

  uncreateTrackJoint(id: string, x: number, z: number, angle: number): void {
    const j2 = this.store.get(id) as TrackJoint;
    j2.remove();
  }

  joinTrackJoints(
    trackId: string,
    coordinates: Coordinate[],
    jointId1: string,
    whichEnd1: WhichEnd,
    jointId2,
    whichEnd2: WhichEnd
  ): TrackBase {
    const one = this.store.get(jointId1) as TrackJoint;
    const other = this.store.get(jointId2) as TrackJoint;

    const track = this.store.create<Track>(TYPES.Track);
    track.presetId(trackId);
    track.init({
      coordinates,
      startJointEnd: { joint: one, end: whichEnd1 },
      endJointEnd: { joint: other, end: whichEnd2 }
    });

    // one.setOneEnd(whichEnd1, track.getAx());
    // other.setOneEnd(whichEnd2, track.getBx());

    return track;
  }

  unjoinTrackJoints(
    trackId: string,
    coordinates: Coordinate[],
    jointId1: string,
    whichEnd1: WhichEnd,
    jointId2,
    whichEnd2: WhichEnd
  ): void {
    const track = this.store.get(trackId) as Track;
    // const one = this.store.get(jointId1) as TrackJoint;
    // const other = this.store.get(jointId2) as TrackJoint;

    // one.removeEnd(track.getAx());
    // other.removeEnd(track.getBx());

    track.remove();
  }

  joinTrackJoints3(
    trackId: string,
    oldCoordinates: Coordinate[],
    coordinates: Coordinate[],
    jointId1: string,
    whichEnd1: WhichEnd,
    jointId2: string,
    whichEnd2: WhichEnd,
    jointId3: string,
    whichEnd3: WhichEnd
  ): TrackBase {
    const trackSwitch = this.store.create<TrackSwitch>(TYPES.TrackSwitch);
    trackSwitch.presetId(trackId);
    const one = this.store.get(jointId1) as TrackJoint;
    const other = this.store.get(jointId2) as TrackJoint;
    const third = this.store.get(jointId3) as TrackJoint;

    trackSwitch.init(
      {
        coordinates: oldCoordinates,
        startJointEnd: { joint: one, end: whichEnd1 },
        endJointEnd: { joint: other, end: whichEnd2 }
      },
      {
        coordinates,
        startJointEnd: { joint: one, end: whichEnd1 },
        endJointEnd: { joint: third, end: whichEnd3 }
      }
    );

    // todo redo
    // one.setOneEnd(whichEnd1, trackSwitch.getA());
    // other.setOneEnd(whichEnd2, trackSwitch.getE());
    // third.setOneEnd(whichEnd3, trackSwitch.getF());

    return trackSwitch;
  }

  unjoinTrackJoints3(
    trackId: string,
    oldCoordinates: Coordinate[],
    coordinates: Coordinate[],
    jointId1: string,
    whichEnd1: WhichEnd,
    jointId2: string,
    whichEnd2: WhichEnd,
    jointId3: string,
    whichEnd3: WhichEnd
  ): void {
    const trackSwitch = this.store.get(trackId) as TrackSwitch;
    const one = this.store.get(jointId1) as TrackJoint;
    const other = this.store.get(jointId2) as TrackJoint;
    const third = this.store.get(jointId3) as TrackJoint;

    // todo redo
    // one.removeEnd(trackSwitch.getA());
    // other.removeEnd(trackSwitch.getE());
    // third.removeEnd(trackSwitch.getF());
    trackSwitch.remove();
  }

  createTrain(
    wagonId: string,
    trainId: string,
    wagonConfig: WagonConfig,
    trackId: string,
    position: number,
    direction: number
  ): Wagon {
    const train = this.store.create<Train>(TYPES.Train);
    train.presetId(trainId);

    const wagon = this.store.create<Wagon>(TYPES.Wagon);
    wagon.presetId(wagonId);
    wagon.init(wagonConfig, train);

    const track = this.store.get(trackId) as Track;
    train.init(
      new PositionOnTrack(
        track,
        position * track.getLength(),
        direction === 1 ? TrackDirection.AB : TrackDirection.BA
      ),
      [wagon]
    );

    return wagon;
  }

  uncreateTrain(
    wagonId: string,
    trainId: string,
    wagonConfig: WagonConfig,
    trackId: string,
    position: number,
    direction: number
  ): void {
    const train = this.store.get(trainId) as Train;
    train.remove();
  }

  moveTrain(trainId: string, posFrom: PositionData, posTo: PositionData): void {
    const train = this.store.get(trainId) as Train;
    train.setPosition(PositionOnTrack.fromData(posTo, this.store));
  }

  unmoveTrain(
    trainId: string,
    posFrom: PositionData,
    posTo: PositionData
  ): void {
    const train = this.store.get(trainId) as Train;
    train.setPosition(PositionOnTrack.fromData(posFrom, this.store));
  }

  pedalTrain(
    trainId: string,
    pedalFrom: SpeedPedal,
    pedalTo: SpeedPedal
  ): void {
    const train = this.store.get(trainId) as Train;
    train.getSpeed().setPedal(pedalTo);
  }

  unpedalTrain(
    trainId: string,
    pedalFrom: SpeedPedal,
    pedalTo: SpeedPedal
  ): void {
    const train = this.store.get(trainId) as Train;
    train.getSpeed().setPedal(pedalFrom);
  }

  mergeTrain(train1Id: string, train2Id: string, wagonId: string): void {
    const train1 = this.store.get(train1Id) as Train;
    const train2 = this.store.get(train2Id) as Train;
    train1.merge(train2);
  }

  unmergeTrain(train1Id: string, train2Id: string, wagonId: string): void {
    const train1 = this.store.get(train1Id) as Train;
    const wagon = this.store.get(wagonId) as Wagon;
    train1.separate(wagon, train2Id);
  }

  reverseTrain(trainId: string): void {
    const train = this.store.get(trainId) as Train;
    train.reverse();
  }

  unreverseTrain(trainId: string): void {
    this.reverseTrain(trainId);
  }

  reverseWagonFacing(wagonId: string): void {
    const wagon = this.store.get(wagonId) as Wagon;
    wagon.swapEnds();
  }

  unreverseWagonFacing(wagonId: string): void {
    this.reverseWagonFacing(wagonId);
  }
}
