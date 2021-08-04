import { TYPES } from '../../di/TYPES';
import { Store } from '../../structs/Interfaces/Store';
import { Route } from '../../structs/Scheduling/Route';
import { RouteStop } from '../../structs/Scheduling/RouteStop';
import { Trip } from '../../structs/Scheduling/Trip';
import { TripStop } from '../../structs/Scheduling/TripStop';
import { Util } from '../../structs/Util';
import { RailMap } from '../RailMap/RailMap';
import { RailMapCreator } from '../RailMap/RailMapCreator';
import { RailDiagramLine } from './RailDiagramLine';
import { RailDiagramPlot } from './RailDiagramPlot';
import { RailDiagramPlotsAndLines } from './RailDiagramPlotsAndLines';

export class RailDiagram {
    private route: Route = null;
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

    setRoute(route: Route) {
        this.route = route;
        this.update();
    }

    update(): void {
        if (this.route) {
            this.updateDiagramHeight();
        }
        this.updateDiagramWidth();
    }

    updateDiagramHeight(): void {
        this.diagramHeight = 0;
        let prevStop: RouteStop = null;
        for (let stop of this.route.getWaypoints()) {
            if (prevStop) {
                this.diagramHeight += this.map.getDistance(
                    prevStop.getWaypoint(),
                    stop.getWaypoint()
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
        let prevStop: RouteStop = null;
        let prevPosition: number = 0;
        for (let stop of this.route.getWaypoints()) {
            if (prevStop) {
                position = this.map.getDistance(
                    prevStop.getWaypoint(),
                    stop.getWaypoint()
                );
                pos += position;
                lines.push({
                    from: { r: prevPosition / this.diagramHeight, t: 0 },
                    to: { r: pos / this.diagramHeight, t: 0 },
                    trackCount: this.map.getTrackCount(
                        prevStop.getWaypoint(),
                        stop.getWaypoint()
                    )
                });
            }

            plots.push({
                id: stop.getWaypoint().getId(),
                position: pos,
                name: stop.getWaypoint().getName(),
                r: pos / this.diagramHeight,
                t: 0
            });

            this.stopHeights[stop.getWaypoint().getId()] = pos / this.diagramHeight;
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
                name: Util.timeToString(time),
                position: 1,
                t: (time - this.minTime) / this.diagramWidth,
                r: 1
            });
        }
        return plots;
    }

    getPlotsAndLines(): RailDiagramPlotsAndLines {
        const plots: RailDiagramPlot[] = [];
        const lines: RailDiagramLine[] = [];
        const routesToPlot: Route[] = this.getConnectingRoutes(this.route);

        const trips = this.store.getAllOf<Trip>(TYPES.Trip);
        for (let trip of trips) {
            if (!routesToPlot.includes(trip.getRoute())) continue;

            let prevStop: TripStop = null;
            for (let stop of trip.getWaypoints()) {
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
                        trackCount: 1
                    });
                }

                plots.push({
                    id: stop.id,
                    name: Util.timeToString(stop.arrivalTime) + '-' + Util.timeToString(stop.departureTime) + ' ' + stop.station.getName(),
                    position: this.stopHeights[stop.station.getId()],
                    t:
                        ((stop.departureTime || stop.arrivalTime) - this.minTime) /
                        this.diagramWidth,
                    r: this.stopHeights[stop.station.getId()],
                    meta: {
                        routeStop: stop.routeStop,
                        route: stop.route,
                        tripStop: stop,
                        trip: stop.trip,
                    }
                });

                prevStop = stop;
            }
        }

        return { plots, lines };
    }

    getConnectingRoutes(pivotRoute: Route): Route[] {
        return (this.store.getAllOf(TYPES.Route) as Route[]).filter(route => {
            return route.hasCommonEdgeWith(pivotRoute);
        });
    }
}
