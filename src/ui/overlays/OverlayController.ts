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
import { Util } from "../../structs/Util";
import { overlayStore, selectRoute, StorableRoute, updateRouteList } from "./store";

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

    updateMap() {
        this.map = RailMapCreator.create(getStore());
    }

    updateRouteList() {
        const rl = getAllOfStorable(TYPES.Route).map(r => r.persistDeep()) as StorableRoute[];
        overlayStore.dispatch(updateRouteList(rl));
    }

    selectRoute(routeId: string) {
        overlayStore.dispatch(selectRoute(routeId));
    }

    createRoute() {
        const route = createStorable<Route>(TYPES.Route).init();
        route.setName(Util.generateRouteName());
        route.setColor(Color.CreateRandom().getHexaString());

        this.selectRoute(route.getId());
        this.updateRouteList();
    }

    // TODO
    controll(type: string, nodeId: string) {
        const state = overlayStore.getState().overlay;
        const routeId = state.selectedRoute;

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
        }
    }
}
