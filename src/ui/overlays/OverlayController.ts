import { TYPES } from "../../di/TYPES";
import { RailMap } from "../../modules/RailMap/RailMap";
import { RailMapCreator } from "../../modules/RailMap/RailMapCreator";
import { RailMapNode } from "../../modules/RailMap/RailMapNode";
import { createStorable, getAllOfStorable, getStorable, getStore } from "../../structs/Actuals/Store/StoreForVue";
import { Color } from "../../structs/Color";
import { WhichEnd } from "../../structs/Interfaces/WhichEnd";
import { ActualRoutePartEdge } from "../../structs/Scheduling/ActualRoutePartEdge";
import { ActualRoutePartJunction } from "../../structs/Scheduling/ActualRoutePartJunction";
import { ActualRoutePartStop } from "../../structs/Scheduling/ActualRoutePartStop";
import { Route } from "../../structs/Scheduling/Route";
import { RoutePart } from "../../structs/Scheduling/RoutePart";
import { RoutePartStop } from "../../structs/Scheduling/RoutePartStop";
import { Trip } from "../../structs/Scheduling/Trip";
import { TripStop } from "../../structs/Scheduling/TripStop";
import { Util } from "../../structs/Util";
import { DiagramCreator } from "./DiagramCreator";
import { RouteManipulator } from "./RouteManipulator";
import { overlayStore, selectRoute, StorableRoute, updateRouteList, setCreateExpress, setOverlayMode, setEndTime, setStartTime, setSelectedTripStop } from "./store";

const DEFAULT_ROUTE_COLORS = ['#fe9812', '#688e26', '#002500', '#10423f', '#20837e', '#f25757', '#e41111', '#432337'];

export class OverlayController {
    private map: RailMap;
    private routeManipulator: RouteManipulator;

    static _instance: OverlayController = null;

    static getInstance(): OverlayController {
        if (!OverlayController._instance) {
            OverlayController._instance = new OverlayController();
        }
        return OverlayController._instance;
    }

    private constructor() {
        this.routeManipulator = new RouteManipulator();
    }

    selectTripStop(tripStop: TripStop): void {
        overlayStore.dispatch(setSelectedTripStop(tripStop ? {
            tripId: tripStop.id,
            routePartNo: tripStop.routePartNo
        } : null));
        this.updateDiagram();
    }

    setStartTime(t: number) {
        overlayStore.dispatch(setStartTime(t));
        this.updateDiagram();
    }

    setEndTime(t: number) {
        overlayStore.dispatch(setEndTime(t));
        this.updateDiagram();
    }

    updateMap(): void {
        if (overlayStore.getState().overlay.overlayMode === 'map') {
            this.map = RailMapCreator.create(getStore());
        }
    }

    updateDiagram(): void {
        if (overlayStore.getState().overlay.overlayMode === 'diagram') {
            DiagramCreator.create(getStore());
        }
    }

    updateRouteList(): void {
        const rl = getAllOfStorable(TYPES.Route).map(r => r.persistDeep()) as StorableRoute[];
        overlayStore.dispatch(updateRouteList(rl));
    }

    selectRoute(route: StorableRoute): void {
        overlayStore.dispatch(selectRoute(route));
        this.updateDiagram();
    }

    deleteRoute(id: string) {
        const route = getStorable(id) as Route;
        route.remove();

        overlayStore.dispatch(selectRoute(null));

        this.updateRouteList();
        this.updateMap();
    }

    moveAll(time: number) {
        const tripStop = overlayStore.getState().overlay.selectedTripStop;

        if (tripStop) {
            const trip = getStorable(tripStop.tripId) as Trip;
            const routeVariant = trip.getRouteVariant();
            routeVariant.moveAll(time);

            this.updateDiagram();
        }
    }

    moveDeparture(time: number) {
        const tripStop = overlayStore.getState().overlay.selectedTripStop;

        if (tripStop) {
            const trip = getStorable(tripStop.tripId) as Trip;
            const routePart: RoutePart = trip.getWaypoints()[tripStop.routePartNo].routePart;

            if (routePart.getType() === TYPES.RoutePartStop) {
                (routePart as RoutePartStop).setDuration(Math.max(0, routePart.getDuration() + time));
                trip.getRouteVariant().emit('update', {});
            }

            this.updateDiagram();
        }
    }

    setSelectExpress(express: boolean) {
        overlayStore.dispatch(setCreateExpress(express));
    }

    setOverlayMode(mode: string) {
        overlayStore.dispatch(setOverlayMode(mode));
        if (mode === 'map' || mode === 'diagram') {
            this.updateRouteList();
        }
        if (mode === 'map') {
            this.updateMap();
        }
        if (mode === 'diagram') {
            this.updateDiagram();
        }
    }

    createRoute(): void {
        const routes = getAllOfStorable<Route>(TYPES.Route);
        const usedColors = routes.map(r => r.getColor());
        const unused = DEFAULT_ROUTE_COLORS.find(color => !usedColors.includes(color));

        const route = createStorable<Route>(TYPES.Route).init();
        route.setName(Util.generateRouteName());
        route.setColor(unused || Color.CreateRandom().getHexaString());

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

    controll(type: string, nodeId: string): void {
        const state = overlayStore.getState().overlay;
        const routeId = state.selectedRoute?.id;
        const express = state.createExpress;

        if (routeId) {
            const route = getStorable(routeId) as Route;
            const variants = route.getVariants();
            const station = getStorable(nodeId) as unknown as RailMapNode;

            if (this.routeManipulator.isRouteEmpty(route)) {
                console.log('first');
                const part = station.getType() === TYPES.Station ? new ActualRoutePartStop(station as RailMapNode) : new ActualRoutePartJunction(station);
                route.addPart(WhichEnd.B, part);
            } else if (this.routeManipulator.isOnRoute(route, station)) {
                if (route.getParts(WhichEnd.A).length === 1) {
                    console.log('remove the only one');
                    route.removePart(WhichEnd.A);
                } else {
                    if (variants[0].getFirstStop().getRef() === station) {
                        console.log('on route - first stop');
                        do {
                            route.removePart(WhichEnd.A);
                            route.removePart(WhichEnd.A);
                        } while (!variants[0].getFirstStop().isStopping() && route.getEnd(WhichEnd.A));
                    } else if (variants[0].getLastStop().getRef() === station) {
                        console.log('on route - last stop');
                        do {
                            route.removePart(WhichEnd.B);
                            route.removePart(WhichEnd.B);
                        } while (!variants[1].getFirstStop().isStopping() && route.getEnd(WhichEnd.B));
                    } else if (station.getType() === TYPES.Station) {
                        console.log('on route - intermediate station');
                        const part: RoutePartStop = route.getParts(WhichEnd.B).find(x => x.getRef() === station) as RoutePartStop;
                        part.setStopping(!part.isStopping());
                    } else {
                        console.log('on route - intermediate pathblock - nothing to do');
                    }
                }
            } else {
                const { addingStations: as0, distance: d0 } = this.routeManipulator.findShortestRoute(
                    this.map, variants[0], variants[0].getLastStop().getRef() as RailMapNode, station
                );
                const { addingStations: as1, distance: d1 } = this.routeManipulator.findShortestRoute(
                    this.map, variants[1], variants[1].getLastStop().getRef() as RailMapNode, station
                );

                // console.log(d0, d1, as0, as1);

                if (d0 === Number.POSITIVE_INFINITY && d1 === Number.POSITIVE_INFINITY) {
                    console.log('no possible route');
                    return;
                }

                const addingStations = d0 < d1 ? as0 : as1;
                const whichEnd = d0 < d1 ? WhichEnd.B : WhichEnd.A;

                let i = 0;
                let prevPart = route.getEnd(whichEnd);

                for (let station3 of addingStations) {
                    const distance = this.map.getDistance(prevPart.getRef() as RailMapNode, station3);

                    const part0 = new ActualRoutePartEdge({ getDuration: () => Math.ceil((distance / 3) / 10) * 10 /*3=maxSpeed*/, getId: () => '', getName: () => '' });
                    route.addPart(whichEnd, part0);
                    const part = station3.getType() === TYPES.Station ? new ActualRoutePartStop(station3 as RailMapNode) : new ActualRoutePartJunction(station3);
                    route.addPart(whichEnd, part);

                    if (express && part.getType() === TYPES.RoutePartStop && station !== station3) {
                        (part as RoutePartStop).setStopping(false);
                    }

                    i++;
                    prevPart = part;
                }
                console.log('added some');
            }

            this.updateRouteList();
            this.updateMap();
        }
    }
}
