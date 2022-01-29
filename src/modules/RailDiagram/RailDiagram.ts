import { TYPES } from '../../di/TYPES';
import { Store } from '../../structs/Interfaces/Store';
import { RoutePart } from '../../structs/Scheduling/RoutePart';
import { RouteVariant } from '../../structs/Scheduling/RouteVariant';
import { Trip } from '../../structs/Scheduling/Trip';
import { TripStop } from '../../structs/Scheduling/TripStop';
import { Util } from '../../structs/Util';
import { RailMap } from '../RailMap/RailMap';
import { RailMapCreator } from '../RailMap/RailMapCreator';
import { RailMapNode } from '../RailMap/RailMapNode';
import { RailDiagramLine } from './RailDiagramLine';
import { RailDiagramPlot } from './RailDiagramPlot';
import { RailDiagramPlotsAndLines } from './RailDiagramPlotsAndLines';

export class RailDiagram {
    private routeVariant: RouteVariant = null;
    private diagramHeight: number = 0;
    private diagramWidth: number = 0;
    private map: RailMap = null;
    private minTime: number = 14400; // 4am  or  4:00
    private maxTime: number = 14400 + 3600 * 3;//86400; // 12am or 24:00
    private stopHeights: Record<string, number> = {};
    private timeIntervals: number = 1800;
    private store: Store;

    constructor(store: Store) {
        this.store = store;
        this.map = RailMapCreator.create(store);
        this.update();
    }

    setRoute(routeVariant: RouteVariant) {
        this.routeVariant = routeVariant;
        this.update();
    }

    setTimeBounds(minTime: number, maxTime: number): void {
        this.minTime = minTime;
        this.maxTime = maxTime;
        this.update();
    }

    getTimeBounds(): { minTime: number, maxTime: number } {
        return {
            minTime: this.minTime,
            maxTime: this.maxTime
        }
    }

    update(): void {
        if (this.routeVariant) {
            this.updateDiagramHeight();
        }
        this.updateDiagramWidth();
    }

    updateDiagramHeight(): void {
        this.diagramHeight = 0;
        let prevStop: RoutePart = null;
        for (let stop of this.routeVariant.getWaypoints()) {
            if (prevStop) {
                this.diagramHeight += this.map.getDistance(
                    prevStop.getRef() as RailMapNode,
                    stop.getRef() as RailMapNode
                );
            }
            prevStop = stop;
        }
    }

    updateDiagramWidth(): void {
        this.diagramWidth = this.maxTime - this.minTime;
    }

    getRouteAxis(): RailDiagramPlotsAndLines {
        this.stopHeights = {};
        const plots: RailDiagramPlot[] = [];
        const lines: RailDiagramLine[] = [];

        let position: number = 0;
        let pos: number = 0;
        let prevStop: RoutePart = null;
        let prevPosition: number = 0;
        for (let stop of this.routeVariant.getWaypoints()) {
            if (prevStop) {
                position = this.map.getDistance(
                    prevStop.getRef() as RailMapNode,
                    stop.getRef() as RailMapNode
                );
                pos += position;
                lines.push({
                    from: { r: prevPosition / this.diagramHeight, t: 0 },
                    to: { r: pos / this.diagramHeight, t: 0 },
                    trackCount: this.map.getTrackCount(
                        prevStop.getRef() as RailMapNode,
                        stop.getRef() as RailMapNode
                    ),
                    zIndex: 60
                });
            }

            plots.push({
                id: (stop.getRef() as RailMapNode).getId(),
                uniqueId: (stop.getRef() as RailMapNode).getId(),
                position: pos,
                name: stop.getRef().getName(),
                r: pos / this.diagramHeight,
                t: 0,
                meta: {
                    hasLine: (stop.getRef() as RailMapNode).getType() === TYPES.Station,
                    routeColor: (stop.getRef() as RailMapNode).getType() === TYPES.Station ? 0x000000 : 0x9f9f9f,
                    stopping: stop.isStopping()
                },
                zIndex: 70
            });

            this.stopHeights[(stop.getRef() as RailMapNode).getId()] = pos / this.diagramHeight;
            prevStop = stop;
            prevPosition = pos;
        }

        return { plots, lines };
    }

    getTimeAxis(): RailDiagramPlot[] {
        const plots: RailDiagramPlot[] = [];
        const timeStart =
            Math.ceil(this.minTime / this.timeIntervals) * this.timeIntervals;
        const timeEnd =
            Math.floor(this.maxTime / this.timeIntervals) * this.timeIntervals;
        for (let time = timeStart; time <= timeEnd; time += this.timeIntervals) {
            plots.push({
                id: time.toString(),
                uniqueId: time.toString(),
                name: Util.timeToString(time),
                position: 1,
                t: (time - this.minTime) / this.diagramWidth,
                r: 1,
                zIndex: 70
            });
        }
        return plots;
    }

    getPlotsAndLines(): RailDiagramPlotsAndLines {
        const plots: RailDiagramPlot[] = [];
        const lines: RailDiagramLine[] = [];
        const routesToPlot: RouteVariant[] = this.getConnectingRoutes(this.routeVariant);

        const trips = this.store.getAllOf<Trip>(TYPES.Trip);
        for (let trip of trips) {
            if (!routesToPlot.includes(trip.getRouteVariant())) continue;

            let prevStop: TripStop = null;
            for (let stop of trip.getWaypoints().filter(w => w.shouldStop)) {
                if (this.stopHeights[stop.station.getId()] === undefined) continue;

                if (prevStop) {
                    lines.push({
                        from: {
                            r: this.stopHeights[prevStop.station.getId()],
                            t: (prevStop.departureTime - this.minTime) / this.diagramWidth
                        },
                        to: {
                            r: this.stopHeights[stop.station.getId()],
                            t: (stop.arrivalTime - this.minTime) / this.diagramWidth
                        },
                        trackCount: 1,
                        meta: {
                            routeColor: stop.route.getColor()
                        }
                    });
                }

                if (stop.hasDepartureTime && stop.hasArrivalTime && stop.departureTime !== stop.arrivalTime) {
                    plots.push({
                        id: stop.id,
                        uniqueId: stop.id + '-arr',
                        name: Util.timeToString(stop.arrivalTime) + '-' + Util.timeToString(stop.departureTime) + ' ' + stop.station.getName(),
                        position: this.stopHeights[stop.station.getId()],
                        t:
                            ((stop.arrivalTime) - this.minTime) /
                            this.diagramWidth,
                        r: this.stopHeights[stop.station.getId()],
                        meta: {
                            routePart: stop.routePart,
                            route: stop.route,
                            tripStop: stop,
                            trip: stop.trip,
                            routeColor: stop.route.getColor()
                        }
                    });
                    plots.push({
                        id: stop.id,
                        uniqueId: stop.id + '-dep',
                        name: Util.timeToString(stop.arrivalTime) + '-' + Util.timeToString(stop.departureTime) + ' ' + stop.station.getName(),
                        position: this.stopHeights[stop.station.getId()],
                        t:
                            ((stop.departureTime) - this.minTime) /
                            this.diagramWidth,
                        r: this.stopHeights[stop.station.getId()],
                        meta: {
                            routePart: stop.routePart,
                            route: stop.route,
                            tripStop: stop,
                            trip: stop.trip,
                            routeColor: stop.route.getColor()
                        }
                    });
                    lines.push({
                        from: {
                            r: this.stopHeights[stop.station.getId()],
                            t: (stop.arrivalTime - this.minTime) / this.diagramWidth
                        },
                        to: {
                            r: this.stopHeights[stop.station.getId()],
                            t: (stop.departureTime - this.minTime) / this.diagramWidth
                        },
                        trackCount: 1,
                        meta: {
                            routeColor: stop.route.getColor()
                        }
                    });
                } else {
                    plots.push({
                        id: stop.id,
                        uniqueId: stop.id,
                        name: Util.timeToString(stop.arrivalTime) + '-' + Util.timeToString(stop.departureTime) + ' ' + stop.station.getName(),
                        position: this.stopHeights[stop.station.getId()],
                        t:
                            ((stop.departureTime || stop.arrivalTime) - this.minTime) /
                            this.diagramWidth,
                        r: this.stopHeights[stop.station.getId()],
                        meta: {
                            routePart: stop.routePart,
                            route: stop.route,
                            tripStop: stop,
                            trip: stop.trip,
                            routeColor: stop.route.getColor()
                        }
                    });
                }

                prevStop = stop;
            }
        }

        return { plots, lines };
    }

    getConnectingRoutes(pivotRoute: RouteVariant): RouteVariant[] {
        return (this.store.getAllOf(TYPES.RouteVariant) as RouteVariant[]).filter(route => {
            return route.hasCommonEdgeWith(pivotRoute);
        });
    }
}
