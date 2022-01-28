import { TYPES } from "../../di/TYPES";
import { RailMap } from "../../modules/RailMap/RailMap";
import { RailMapCreator } from "../../modules/RailMap/RailMapCreator";
import { RailMapNode } from "../../modules/RailMap/RailMapNode";
import { Station } from "../../modules/Station/Station";
import { createStorable, getAllOfStorable, getStorable, getStore } from "../../structs/Actuals/Store/StoreForVue";
import { Color } from "../../structs/Color";
import { WhichEnd } from "../../structs/Interfaces/WhichEnd";
import { ActualRoutePartEdge } from "../../structs/Scheduling/ActualRoutePartEdge";
import { ActualRoutePartJunction } from "../../structs/Scheduling/ActualRoutePartJunction";
import { ActualRoutePartStop } from "../../structs/Scheduling/ActualRoutePartStop";
import { Route } from "../../structs/Scheduling/Route";
import { Trip } from "../../structs/Scheduling/Trip";
import { Util } from "../../structs/Util";
import { overlayStore, selectRoute, StorableRoute, updateRouteList, setCreateExpress } from "./store";

export class OverlayController {
    private map: RailMap;

    static _instance: OverlayController = null;

    static getInstance(): OverlayController {
        if (!OverlayController._instance) {
            OverlayController._instance = new OverlayController();
        }
        return OverlayController._instance;
    }

    private constructor() { }

    updateMap(): void {
        this.map = RailMapCreator.create(getStore());
    }

    updateRouteList(): void {
        const rl = getAllOfStorable(TYPES.Route).map(r => r.persistDeep()) as StorableRoute[];
        overlayStore.dispatch(updateRouteList(rl));
    }

    selectRoute(route: StorableRoute): void {
        overlayStore.dispatch(selectRoute(route));
    }

    setSelectExpress(express: boolean) {
        overlayStore.dispatch(setCreateExpress(express));
    }

    createRoute(): void {
        const route = createStorable<Route>(TYPES.Route).init();
        route.setName(Util.generateRouteName());
        route.setColor(Color.CreateRandom().getHexaString());

        this.selectRoute(route.persistDeep() as StorableRoute);
        this.updateRouteList();
    }

    createExampleTrips(routeId: string): void {
        const route = getStorable(routeId) as Route;
        const variants = route.getVariants();

        const trip1 = createStorable<Trip>(TYPES.Trip).init(variants[0], 4 * 3600 + Math.floor(Math.random() * 3600));
        const trip2 = createStorable<Trip>(TYPES.Trip).init(variants[1], 5 * 3600 + Math.floor(Math.random() * 3600));
        trip1.setNextTrip(trip2);
        trip2.setPrevTrip(trip1);
    }

    // TODO
    controll(type: string, nodeId: string): void {
        const state = overlayStore.getState().overlay;
        const routeId = state.selectedRoute.id;

        if (routeId) {
            const route = getStorable(routeId) as Route;
            const routeVariant = route.getVariants()[0];
            const station = getStorable(nodeId) as Station;

            let addingStations: RailMapNode[] = [station];
            let dist: number[] = [];
            if (routeVariant.getLastStop()) {
                const result = this.map.getShortestPath(
                    routeVariant.getLastStop().getRef() as RailMapNode,
                    station
                );
                for (let i = 1; i < result.length; i++) {
                    dist.push(this.map.getDistance(result[i - 1], result[i]));
                }
                addingStations = result.slice(1);
            }
            const last = addingStations[addingStations.length - 1];

            let i = 0;
            for (let station of addingStations) {
                if (i !== 0 || addingStations.length !== 1) {
                    const part = new ActualRoutePartEdge({ getDuration: () => 120, getId: () => '', getName: () => '' });
                    route.addPart(WhichEnd.B, part);
                }
                const part = station.getType() === TYPES.Station ? new ActualRoutePartStop(station as RailMapNode) : new ActualRoutePartJunction(station);
                route.addPart(WhichEnd.B, part);

                // todo if express
                // if (station !== last) {
                //     stop.setShouldStop(false);
                // }

                i++;
            }

            this.updateRouteList();
            this.updateMap();
        }
    }
}
