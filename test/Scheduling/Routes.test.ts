import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../src/di/test.config';
import { TYPES } from '../../src/di/TYPES';
import { Route } from '../../src/structs/Scheduling/Route';
import { RouteStop } from '../../src/structs/Scheduling/RouteStop';
import { Station } from '../../src/modules/Station/Station';
import { Store } from '../../src/structs/Interfaces/Store';
import { Circle } from '../../src/structs/Geometry/Circle';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
chai.use(chaiAlmost());

const RouteFactory = testContainer.get<() => Route>(TYPES.FactoryOfRoute);
const RouteStopFactory = testContainer.get<() => RouteStop>(
    TYPES.FactoryOfRouteStop
);
const StationFactory = testContainer.get<() => Station>(TYPES.FactoryOfStation);
const StoreFactory = testContainer.get<() => Store>(TYPES.FactoryOfStore);

const circle = new Circle(new Coordinate(0, 0, 0), 20);

describe('Routes', () => {
    it('creates a new route', () => {
        const route = RouteFactory().init();
        expect(route.getId()).not.equals(undefined);
        expect(route.getName()).not.equals(undefined);
        expect(route.getStops()).deep.equals([]);
    });

    it('sets name', () => {
        const name = 'B12';
        const route = RouteFactory().init();
        route.setName(name);
        expect(route.getName()).equals(name);
    });

    it('adds a stop', () => {
        const route = RouteFactory().init();
        const stationName = 'Stadium';
        const station = StationFactory().init(circle);
        station.setName(stationName);
        const stop = RouteStopFactory().init(station);
        route.addWaypoint(stop);
        expect(route.getStops()).deep.equals([stop]);
        expect(route.getStops()[0].getWaypointName()).equals(stationName);
    });

    it('adds and removes a stop', () => {
        const route = RouteFactory().init();
        const station = StationFactory().init(circle);
        const stop = RouteStopFactory().init(station);
        route.addWaypoint(stop);
        route.removeStop(stop);
        expect(route.getStops()).deep.equals([]);
    });

    it('list all the routes', () => {
        const store = StoreFactory();
        store.clear();
        const route1 = RouteFactory().init();
        const route2 = RouteFactory().init();
        const routes = store.getFiltered(x => x.constructor.name === 'ActualRoute');
        expect(routes).deep.equals([route1, route2]);
    });
});
