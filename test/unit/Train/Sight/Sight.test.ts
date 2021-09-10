import { expect } from "chai";
import { TrackDirection } from "../../../../src/modules/Track/TrackDirection";
import { PositionOnTrack } from "../../../../src/modules/Train/PositionOnTrack";
import { ActualTrainSight } from "../../../../src/modules/Train/Sight/ActualTrainSight";
import { Sight } from "../../../../src/modules/Train/Sight/Sight";
import { TrainSight } from "../../../../src/modules/Train/Sight/TrainSight";
import { createTrack } from "../../Track/util";

describe('TrainSight', () => {
    it('Sight of zero', () => {
        const { track } = createTrack(100);
        const dt = track.getDirected(TrackDirection.AB);
        const pos = new PositionOnTrack(dt, 0);

        const trainSight: TrainSight = new ActualTrainSight();
        const sight: Sight = trainSight.getSight(pos, 0);
        const expectedSight: Sight = {
            position: pos,
            distance: 0,
            markers: []
        };
        expect(sight).deep.equals(expectedSight);
    });
});
