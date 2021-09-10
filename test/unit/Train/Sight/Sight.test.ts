import { expect } from "chai";
import { TYPES } from "../../../../src/di/TYPES";
import { Signal } from "../../../../src/modules/Signaling/Signal";
import { TrackDirection } from "../../../../src/modules/Track/TrackDirection";
import { TrackMarker } from "../../../../src/modules/Track/TrackMarker";
import { PositionOnTrack } from "../../../../src/modules/Train/PositionOnTrack";
import { ActualTrainSight } from "../../../../src/modules/Train/Sight/ActualTrainSight";
import { Sight } from "../../../../src/modules/Train/Sight/Sight";
import { TrainSight } from "../../../../src/modules/Train/Sight/TrainSight";
import { Platform } from "../../../../src/structs/Interfaces/Platform";
import { Side } from "../../../../src/structs/Interfaces/Side";
import { getTestStore } from "../../../getTestStore";
import { createTrack, createTrackLine } from "../../Track/util";

const store = getTestStore();

describe('TrainSight', () => {
    it('Sight of zero', () => {
        const { track } = createTrack(100);
        const dt = track.getDirected(TrackDirection.AB);
        const pos = new PositionOnTrack(dt, 0);

        const trainSight: TrainSight = new ActualTrainSight();
        const sight: Sight = trainSight.getSight(pos, 0);
        const expectedSight: Sight = {
            distance: 0,
            markers: []
        };
        expect(sight).deep.equals(expectedSight);
    });

    it('Limited Sight on multiple tracks', () => {
        const { track } = createTrackLine(3, 10);
        const dt0 = track[0].getDirected(TrackDirection.AB);
        const dt1 = track[1].getDirected(TrackDirection.AB);
        const pos = new PositionOnTrack(dt0, 0);

        const pos1 = new PositionOnTrack(dt0, 1);
        store.create<Signal>(TYPES.Signal).init(pos1);

        const platform = store.create<Platform>(TYPES.Platform).init(track[1], 2, 8, Side.Left);
        const marker2: TrackMarker = { type: 'Platform', platform };
        dt0.addMarker(2, marker2);

        const pos4 = new PositionOnTrack(dt1, 4);
        store.create<Signal>(TYPES.Signal).init(pos4);

        const trainSight: TrainSight = new ActualTrainSight();
        const sight: Sight = trainSight.getSight(pos, 13);
        const expectedSight: Sight = {
            distance: 13,
            markers: [
                { type: 'Signal', speed: 0 },
                { type: 'Platform', speed: 0 },
            ]
        };
        expect(sight).deep.equals(expectedSight);
    });

    it('Sight to the end', () => {
        const { track } = createTrackLine(3, 10);
        const dt0 = track[0].getDirected(TrackDirection.AB);
        const pos = new PositionOnTrack(dt0, 0);

        const trainSight: TrainSight = new ActualTrainSight();
        const sight: Sight = trainSight.getSight(pos, 30);
        const expectedSight: Sight = {
            distance: 20,
            markers: [
                { type: 'End', speed: 0 },
            ]
        };
        expect(sight).deep.equals(expectedSight);
    });
});
