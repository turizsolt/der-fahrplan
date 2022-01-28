import * as PIXI from 'pixi.js';
import { TYPES } from '../../di/TYPES';
import { Store } from '../../structs/Interfaces/Store';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { Station } from '../Station/Station';
import { BlockEnd } from '../Signaling/BlockEnd';
import { DirectedBlock } from '../Signaling/DirectedBlock';
import { PathBlock } from '../Signaling/PathBlock';
import { PathBlockEnd } from '../Signaling/PathBlockEnd';
import { TrackDirection } from '../Track/TrackDirection';
import { ActualRailMap } from './ActualRailMap';
import { RailMap } from './RailMap';
import { RailMapNode } from './RailMapNode';
import { Route } from '../../structs/Scheduling/Route';
import { RailMapEdge } from './RailMapEdge';
import { PixiClickGeneral } from '../../ui/babylon/PixiClick';
import { OverlayController } from '../../ui/overlays/OverlayController';
import { overlayStore } from '../../ui/overlays/store';

const DEFAULT_NODE_SIZE = 5;

const mapNodes: PIXI.Graphics[] = [];
const mapNodeTexts: PIXI.Text[] = [];
const mapStops: PIXI.Graphics[] = [];
const mapEdges: PIXI.Graphics[] = [];
const routeEdges: PIXI.Graphics[] = [];
let boundingRect: PIXI.Graphics = null;

export class RailMapCreator {
    static create(store: Store): RailMap {
        const pathBlocks = store.getAllOf(TYPES.PathBlock) as PathBlock[];
        const stations = (store.getAllOf(TYPES.Station) as Station[]);
        const routes = (store.getAllOf(TYPES.Route) as Route[]);

        const map: RailMap = new ActualRailMap();
        map.addNodes(pathBlocks as RailMapNode[]);
        map.addNodes(stations as RailMapNode[]);

        for (let pathBlock of pathBlocks) {
            for (let end of pathBlock.getPathBlockEnds()) {
                let dist: number = 0;
                let start: DirectedBlock = end.getOtherEnd().getStart();
                let nextOtherEnd: BlockEnd = null;
                let oneAheadEnd: BlockEnd = end;

                // find next PathBlock
                const nodes: { distance: number, node: RailMapNode }[] = [{ node: pathBlock, distance: 0 }];
                while (true) {
                    if (!start) break;

                    for (let trackPart of start.getTrackParts()) {
                        // get markers
                        const markers = trackPart.track.getMarkersPartially(trackPart);
                        const filteredMarkers = markers.filter(
                            m => m.marker.type === 'Platform'
                        );

                        if (filteredMarkers.length === 0) {
                            dist += trackPart.endPosition - trackPart.startPosition;
                        } else {
                            let pos = trackPart.startPosition;
                            filteredMarkers.map(m => {
                                dist += m.position - pos;
                                nodes.push({ node: m.marker.platform.getStation(), distance: dist });
                                dist = 0;
                                pos = m.position;
                            });
                            dist += trackPart.endPosition - pos;
                        }
                    }

                    const nextEnd = start
                        .getBlock()
                        .getEnd(
                            start.getDirection() === TrackDirection.AB
                                ? WhichEnd.B
                                : WhichEnd.A
                        );
                    oneAheadEnd = nextEnd;
                    nextOtherEnd = nextEnd.getOtherEnd();

                    if (!nextOtherEnd) break;
                    if (nextOtherEnd.getType() === TYPES.PathBlockEnd) break;
                    start = start.next();
                }
                if (nextOtherEnd) {
                    nodes.push({ node: (nextOtherEnd as PathBlockEnd).getPathBlock(), distance: dist });
                    for (let i = 1; i < nodes.length; i++) {
                        map.addEdge(nodes[i - 1].node, nodes[i].node, 0.5, nodes[i].distance / 2);
                    }
                } else {
                    // todo push a deadend node
                    for (let i = 1; i < nodes.length; i++) {
                        map.addEdge(nodes[i - 1].node, nodes[i].node, 1, nodes[i].distance);
                    }
                }
            }
        }

        for (let route of routes) {
            map.addRoute(route);
        }

        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let minZ = Number.POSITIVE_INFINITY;
        let maxZ = Number.NEGATIVE_INFINITY;

        for (let node of map.getNodes()) {
            const coord = node.getCoord();
            if (coord.x < minX) { minX = coord.x };
            if (coord.x > maxX) { maxX = coord.x };
            if (coord.z < minZ) { minZ = coord.z };
            if (coord.z > maxZ) { maxZ = coord.z };
        }

        map.setBounds({ minX, minZ, maxX, maxZ });


        const border = 20;

        if (globalThis.stageMap) {
            if (!boundingRect) {
                boundingRect = new PIXI.Graphics();

                boundingRect.clear();
                boundingRect.beginFill(0xddffdd);
                boundingRect.drawRect(minX, minZ, maxX - minX, maxZ - minZ);
                boundingRect.endFill();
                boundingRect.zIndex = 1;
                boundingRect.renderable = false;

                globalThis.stageMap.addChild(boundingRect);
            }

            const scale = Math.min(
                (globalThis.containerMap.clientWidth - 2 * border) / (maxX - minX),
                (globalThis.containerMap.clientHeight - 2 * border) / (maxZ - minZ)
            );
            globalThis.stageMap.x = -minX * scale + border;
            globalThis.stageMap.y = -minZ * scale + border;
            globalThis.stageMap.scale.x = scale;
            globalThis.stageMap.scale.y = scale;
        }

        // edges

        const e = map.getEdges();
        const railMapEdges: RailMapEdge[] = [];
        for (let ee of Object.keys(e)) {
            railMapEdges.push(e[ee]);
        }

        let i = 0;
        for (; i < railMapEdges.length; i++) {
            if (!mapEdges[i]) {
                mapEdges[i] = new PIXI.Graphics();
                globalThis.stageMap.addChild(mapEdges[i]);
            }

            mapEdges[i].clear();
            mapEdges[i].lineStyle(1, 0xafafaf, railMapEdges[i].routeCount > 0 ? 0 : 0.5);
            const from = railMapEdges[i].from.getCoord();
            const to = railMapEdges[i].to.getCoord();
            mapEdges[i].moveTo(from.x, from.z);
            mapEdges[i].lineTo(to.x, to.z);

            mapEdges[i].zIndex = 10;
            mapEdges[i].renderable = true;
        }

        for (; i < mapEdges.length; i++) {
            mapEdges[i].renderable = false;
        }

        // routes

        const selectedRouteId = overlayStore.getState().overlay.selectedRoute?.id;

        i = 0;
        for (let route of map.getRoutes()) {
            for (let edge of route) {
                const normalColor = parseInt(edge.color.slice(1), 16);
                const shouldSee = (!selectedRouteId || edge.routeId === selectedRouteId);
                const selected = edge.routeId === selectedRouteId;
                const color = shouldSee ? normalColor : 0xafafaf;

                if (!routeEdges[i]) {
                    routeEdges[i] = new PIXI.Graphics();
                    globalThis.stageMap.addChild(routeEdges[i]);
                }

                routeEdges[i].clear();
                routeEdges[i].lineStyle(4, color, shouldSee ? 1 : 0.5);
                const from = edge.from.coord; //fromHere(0, edge.count * 5).fromHere(Math.PI / 2, 6 * edge.no).coord;
                const to = edge.to.coord; //fromHere(0, edge.count * 5).fromHere(-Math.PI / 2, 6 * edge.no).coord;
                routeEdges[i].moveTo(from.x, from.z);
                routeEdges[i].lineTo(to.x, to.z);

                routeEdges[i].zIndex = selected ? 26 : 11;
                routeEdges[i].renderable = true;
                i++;
            }
        }

        for (; i < routeEdges.length; i++) {
            routeEdges[i].renderable = false;
        }

        // nodes

        const overlayController = OverlayController.getInstance();

        const railMapNodes = map.getNodes();
        const nodeSizes = map.getNodesSize();

        i = 0;
        for (; i < railMapNodes.length; i++) {
            if (!mapNodes[i]) {
                mapNodes[i] = new PIXI.Graphics();
                globalThis.stageMap.addChild(mapNodes[i]);
            }

            mapNodes[i].clear();
            mapNodes[i].lineStyle(1, railMapNodes[i].getType() === TYPES.PathBlock ? 0xff0000 : 0x000000, 0.5);
            mapNodes[i].beginFill(0xcfcfcf);
            mapNodes[i].drawCircle(0, 0, railMapNodes[i].getType() === TYPES.PathBlock ? 5 : ((nodeSizes[railMapNodes[i].getId()] || 0) + 1) * DEFAULT_NODE_SIZE);
            mapNodes[i].endFill();
            mapNodes[i].zIndex = 5;
            mapNodes[i].x = railMapNodes[i].getCoord().x;
            mapNodes[i].y = railMapNodes[i].getCoord().z;
            mapNodes[i].renderable = (railMapNodes[i].getType() !== TYPES.PathBlock || !!selectedRouteId);
            PixiClickGeneral(mapNodes[i], railMapNodes[i].getType().description, railMapNodes[i].getId(),
                (x, y, type, id) => overlayController.controll(type, id)
            );
        }

        for (; i < mapNodes.length; i++) {
            mapNodes[i].renderable = false;
        }

        // nodeTexts

        const settings: Partial<PIXI.ITextStyle> = {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0x000000,
            align: 'left',
            fontWeight: '400',
        };

        i = 0;
        for (; i < railMapNodes.length; i++) {
            if (!mapNodeTexts[i]) {
                mapNodeTexts[i] = new PIXI.Text('', settings);
                globalThis.stageMap.addChild(mapNodeTexts[i]);
            }

            mapNodeTexts[i].text = railMapNodes[i].getName();
            const extra = (nodeSizes[railMapNodes[i].getId()] || 0) * DEFAULT_NODE_SIZE;
            mapNodeTexts[i].x = railMapNodes[i].getCoord().x + extra;
            mapNodeTexts[i].y = railMapNodes[i].getCoord().z + extra;
            mapNodeTexts[i].zIndex = 41;
            mapNodeTexts[i].resolution = 10;
            mapNodeTexts[i].anchor.x = 0;
            mapNodeTexts[i].anchor.y = 0;
            mapNodeTexts[i].renderable = railMapNodes[i].getType() !== TYPES.PathBlock;
        }

        for (; i < mapNodeTexts.length; i++) {
            mapNodeTexts[i].renderable = false;
        }

        // stops

        const railMapStops = map.getStops();

        i = 0; let j = 0;
        for (; j < railMapStops.length; j++) {
            if (railMapStops[j].stopping) {
                if (!mapStops[i]) {
                    mapStops[i] = new PIXI.Graphics();
                    globalThis.stageMap.addChild(mapStops[i]);
                }

                const shouldSee = (!selectedRouteId || railMapStops[j].routeId === selectedRouteId);
                const selected = railMapStops[j].routeId === selectedRouteId;
                const color = shouldSee ? parseInt(railMapStops[j].color.slice(1), 16) : 0xafafaf;
                mapStops[i].clear();
                mapStops[i].lineStyle(2, railMapStops[j].stopping ? 0x000000 : color, 1);
                mapStops[i].beginFill(0xcceecc);//color);
                mapStops[i].drawCircle(0, 0, (selected ? 1.2 : 1) * (railMapStops[j].stopping ? 3 : 1.5));
                mapStops[i].endFill();
                mapStops[i].zIndex = selected ? 30 : 25;
                mapStops[i].x = railMapStops[j].point.coord.x;
                mapStops[i].y = railMapStops[j].point.coord.z;
                mapStops[i].renderable = true;
                i++;
            }
        }

        for (; i < mapStops.length; i++) {
            mapStops[i].renderable = false;
        }

        return map;
    }
}
