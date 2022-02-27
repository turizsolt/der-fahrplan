import { expect } from "chai";
import { TYPES } from "../../../../src/di/TYPES";
import { Signal } from "../../../../src/modules/Signaling/Signal";
import { SignalSignal } from "../../../../src/modules/Signaling/SignalSignal";
import { TrackDirection } from "../../../../src/modules/Track/TrackDirection";
import { TrackMarker } from "../../../../src/modules/Track/TrackMarker";
import { PositionOnTrack } from "../../../../src/modules/Train/PositionOnTrack";
import { ActualTrainSight } from "../../../../src/modules/Train/Sight/ActualTrainSight";
import { Sight } from "../../../../src/modules/Train/Sight/Sight";
import { TrainSight } from "../../../../src/modules/Train/Sight/TrainSight";
import { Circle } from "../../../../src/structs/Geometry/Circle";
import { Coordinate } from "../../../../src/structs/Geometry/Coordinate";
import { Platform } from "../../../../src/modules/Station/Platform";
import { Side } from "../../../../src/structs/Interfaces/Side";
import { Station } from "../../../../src/modules/Station/Station";
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

        const platform = store.create<Platform>(TYPES.Platform).init(track[1], 0.2, 0.8, Side.Left);
        const marker2: TrackMarker = { type: 'Platform', platform };
        dt0.addMarker(2, marker2);

        const pos4 = new PositionOnTrack(dt1, 4);
        store.create<Signal>(TYPES.Signal).init(pos4);

        const trainSight: TrainSight = new ActualTrainSight();
        const sight: Sight = trainSight.getSight(pos, 13);
        const expectedSight: Sight = {
            distance: 13,
            markers: [
                { type: 'Signal', distance: 1, speed: 0, object: undefined },
                { type: 'Platform', distance: 2, speed: 0, object: platform },
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
            markers: [],
            // todo when using ends again
            //    { type: 'End', distance: 20, speed: 0, object: undefined },
            //]
        };
        expect(sight).deep.equals(expectedSight);
    });

    it('Platform returns speed (should not stop there)', () => {
        const { track } = createTrack(10);
        const dt0 = track.getDirected(TrackDirection.AB);
        const pos = new PositionOnTrack(dt0, 0);

        const platform = store.create<Platform>(TYPES.Platform).init(track, 0.2, 0.8, Side.Left);
        // should put the station away from the platform
        const station = store.create<Station>(TYPES.Station).init(new Circle(new Coordinate(100, 0, 100), 0));
        const marker2: TrackMarker = { type: 'Platform', platform };
        dt0.addMarker(2, marker2);

        const trainSight: TrainSight = new ActualTrainSight();
        const sight: Sight = trainSight.getSight(pos, 5, station);
        const expectedSight: Sight = {
            distance: 5,
            markers: [
                { type: 'Platform', distance: 2, speed: Number.POSITIVE_INFINITY, object: platform },
            ]
        };
        expect(sight).deep.equals(expectedSight);
    });

    it('Signal returns speed (should not stop there)', () => {
        const { track } = createTrack(10);
        const dt0 = track.getDirected(TrackDirection.AB);
        const pos = new PositionOnTrack(dt0, 0);

        const pos1 = new PositionOnTrack(dt0, 1);
        const signal = store.create<Signal>(TYPES.Signal).init(pos1);
        signal.setBlockSignal(SignalSignal.Green);

        const trainSight: TrainSight = new ActualTrainSight();
        const sight: Sight = trainSight.getSight(pos, 5);
        const expectedSight: Sight = {
            distance: 5,
            markers: [
                { type: 'Signal', distance: 1, speed: Number.POSITIVE_INFINITY, object: undefined },
            ]
        };
        expect(sight).deep.equals(expectedSight);
    });

});
