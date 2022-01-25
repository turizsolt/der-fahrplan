import { expect } from "chai";
import { TYPES } from "../../../src/di/TYPES";
import { persistReadableTravelPathes, persistTravelPathes, TravelPath, TravelPathPersisted } from "../../../src/modules/Travel/TravelPath";
import { TravelPathes } from "../../../src/modules/Travel/TravelPathes";
import { Circle } from "../../../src/structs/Geometry/Circle";
import { Coordinate } from "../../../src/structs/Geometry/Coordinate";
import { Route } from "../../../src/structs/Scheduling/Route";
import { RouteStop } from "../../../src/structs/Scheduling/RouteStop";
import { Station } from "../../../src/modules/Station/Station";
import { getTestStore } from "../../getTestStore";

const store = getTestStore();

const createRoute = (name: string, station: Station[], times: number[]): Route => {
    const route = store.create<Route>(TYPES.Route).init();
    route.setName(name);
    for (let i = 0; i < station.length; i++) {
        route.addWaypoint(store.create<RouteStop>(TYPES.RouteStop).init(station[i], null, route, times[i], times[i]));
    }
    return route;
}



xdescribe('Travel', () => {

    let stA: Station;
    let stB: Station;
    let stC: Station;
    let stD: Station;
    let stE: Station;
    let stF: Station;
    let stG: Station;

    let rAC: Route;
    let rABC: Route;
    let rAF: Route;
    let rADF: Route;
    let rBEG: Route;
    let rDEC: Route;
    let rFG: Route;

    let rCA: Route;
    let rCBA: Route;
    let rFA: Route;
    let rFDA: Route;
    let rGEB: Route;
    let rCED: Route;
    let rGF: Route;

    before(() => {
        const circle = new Circle(Coordinate.Origo(), 0);
        stA = store.create<Station>(TYPES.Station).init(circle);
        stB = store.create<Station>(TYPES.Station).init(circle);
        stC = store.create<Station>(TYPES.Station).init(circle);
        stD = store.create<Station>(TYPES.Station).init(circle);
        stE = store.create<Station>(TYPES.Station).init(circle);
        stF = store.create<Station>(TYPES.Station).init(circle);
        stG = store.create<Station>(TYPES.Station).init(circle);

        stA.setName('A');
        stB.setName('B');
        stC.setName('C');
        stD.setName('D');
        stE.setName('E');
        stF.setName('F');
        stG.setName('G');

        rAC = createRoute('AC', [stA, stC], [0, 5]);
        rABC = createRoute('ABC', [stA, stB, stC], [0, 3, 6]);
        rAF = createRoute('AF', [stA, stF], [0, 7]);
        rADF = createRoute('ADF', [stA, stD, stF], [0, 4, 8]);
        rBEG = createRoute('BEG', [stB, stE, stG], [0, 3, 7]);
        rDEC = createRoute('DEC', [stD, stE, stC], [0, 4, 8]);
        rFG = createRoute('FG', [stF, stG], [0, 5]);

        rCBA = createRoute('CBA', [stC, stB, stA], [0, 3, 6]);
        rCA = createRoute('CA', [stC, stA], [0, 5]);
        rFA = createRoute('FA', [stF, stA], [0, 7]);
        rFDA = createRoute('FDA', [stF, stD, stA], [0, 4, 8]);
        rGEB = createRoute('GEB', [stG, stE, stB], [0, 4, 7]); // note: middle value is different from the top list
        rCED = createRoute('CED', [stC, stE, stD], [0, 4, 8]);
        rGF = createRoute('DF', [stG, stF], [0, 5]);

        /****************
         *    /--5--\
         *   A-3-B-3-C
         *  /4   3  4
         * 7 D-4-E-/
         *  \4   4
         *   F-5-G
         ***************/
    });

    it('getPathes: no pathes', () => {
        const travelPathes: TravelPathes = new TravelPathes(store);
        travelPathes.find();
        const stFake: Station = { getId: () => undefined } as Station;
        const pathes: TravelPath[] = travelPathes.getPathes(stFake, stFake);
        expect(pathes).deep.equals([]);
    });

    it('level1: no direct pathes', () => {
        const travelPathes: TravelPathes = new TravelPathes(store);
        travelPathes.find();

        const pathesAG: TravelPathPersisted[] = persistTravelPathes(travelPathes.getPathes(stA, stG));
        const expectedAG: TravelPathPersisted[] = [];
        expect(pathesAG).deep.equals(expectedAG);
    });

    it('level1: one path', () => {
        const travelPathes: TravelPathes = new TravelPathes(store);
        travelPathes.find();

        const pathesAB: TravelPathPersisted[] = persistTravelPathes(travelPathes.getPathes(stA, stB));
        const expectedAB: TravelPathPersisted[] = [{ score: 3, changes: [{ route: rABC.getId(), station: stB.getId(), time: 3 }] }];
        expect(pathesAB).deep.equals(expectedAB);
    });

    it('level1: multiple pathes', () => {
        const travelPathes: TravelPathes = new TravelPathes(store);
        travelPathes.find();

        const pathesAC: TravelPathPersisted[] = persistTravelPathes(travelPathes.getPathes(stA, stC));
        const expectedAC: TravelPathPersisted[] = [
            { score: 5, changes: [{ route: rAC.getId(), station: stC.getId(), time: 5 }] },
            { score: 6, changes: [{ route: rABC.getId(), station: stC.getId(), time: 6 }] }
        ];
        expect(pathesAC).deep.equals(expectedAC);
    });

    it('level2: transfer path', () => {
        const travelPathes: TravelPathes = new TravelPathes(store);
        travelPathes.find(2);

        const pathesAG: TravelPathPersisted[] = persistTravelPathes(travelPathes.getPathes(stA, stG));
        const expectedAG: TravelPathPersisted[] = [
            {
                score: 10, changes: [
                    { route: rABC.getId(), station: stB.getId(), time: 3 },
                    { route: rBEG.getId(), station: stG.getId(), time: 7 }
                ]
            },
            {
                score: 12, changes: [
                    { route: rAF.getId(), station: stF.getId(), time: 7 },
                    { route: rFG.getId(), station: stG.getId(), time: 5 }
                ]
            },
            {
                score: 13, changes: [
                    { route: rADF.getId(), station: stF.getId(), time: 8 },
                    { route: rFG.getId(), station: stG.getId(), time: 5 }
                ]
            }

        ];
        expect(pathesAG).deep.equals(expectedAG);
    });

    it('level3: multiple transfer path', () => {
        const travelPathes: TravelPathes = new TravelPathes(store);
        travelPathes.find(4);

        const pathesAG: TravelPathPersisted[] = persistTravelPathes(travelPathes.getPathes(stA, stG));
        const expectedAG: TravelPathPersisted[] = [
            {
                score: 10, changes: [
                    { route: rABC.getId(), station: stB.getId(), time: 3 },
                    { route: rBEG.getId(), station: stG.getId(), time: 7 }
                ]
            },
            {
                score: 12, changes: [
                    { route: rAF.getId(), station: stF.getId(), time: 7 },
                    { route: rFG.getId(), station: stG.getId(), time: 5 }
                ]
            },
            {
                score: 12, changes: [
                    { route: rADF.getId(), station: stD.getId(), time: 4 },
                    { route: rDEC.getId(), station: stE.getId(), time: 4 },
                    { route: rBEG.getId(), station: stG.getId(), time: 4 }
                ]
            },
            {
                score: 13, changes: [
                    { route: rADF.getId(), station: stF.getId(), time: 8 },
                    { route: rFG.getId(), station: stG.getId(), time: 5 }
                ]
            },
            {
                score: 13, changes: [
                    { route: rAC.getId(), station: stC.getId(), time: 5 },
                    { route: rCED.getId(), station: stE.getId(), time: 4 },
                    { route: rBEG.getId(), station: stG.getId(), time: 4 }
                ]
            },
            {
                score: 14, changes: [
                    { route: rABC.getId(), station: stC.getId(), time: 6 },
                    { route: rCED.getId(), station: stE.getId(), time: 4 },
                    { route: rBEG.getId(), station: stG.getId(), time: 4 }
                ]
            },
            {
                score: 15, changes: [
                    { route: rAC.getId(), station: stC.getId(), time: 5 },
                    { route: rCBA.getId(), station: stB.getId(), time: 3 },
                    { route: rBEG.getId(), station: stG.getId(), time: 7 }
                ]
            }
        ];
        expect(pathesAG).deep.equals(expectedAG);
    });
});
