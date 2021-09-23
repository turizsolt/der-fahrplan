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

describe('Persisting Route, RouteStop, Station', () => {
    it('persist', () => {
        const store = StoreFactory();
        store.clear();

        const route = RouteFactory().init();
        const station = StationFactory().init(circle);
        const stop1 = RouteStopFactory().init(station);
        const stop2 = RouteStopFactory().init(station);
        route.setName('B12');
        station.setName('Stadium');
        route.addWaypoint(stop1);
        route.addWaypoint(stop2);

        const json = store.persistAll();
        store.clear();
        expect(store.getAll()).deep.equals({});

        store.loadAll(json as any[]);

        expect(store.getAll()[route.getId()].persist()).deep.equals(
            route.persist()
        );
        expect(store.getAll()[station.getId()].persist()).deep.equals(
            station.persist()
        );
        expect(store.getAll()[stop1.getId()].persist()).deep.equals(
            stop1.persist()
        );
        expect(store.getAll()[stop2.getId()].persist()).deep.equals(
            stop2.persist()
        );
    });
});
