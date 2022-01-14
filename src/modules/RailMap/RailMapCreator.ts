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

const mapNodes: PIXI.Graphics[] = [];
const mapEdges: PIXI.Graphics[] = [];

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

        const boundingRect = new PIXI.Graphics();
        const border = 20;

        boundingRect.beginFill(0xddffdd);
        boundingRect.drawRect(minX, minZ, maxX - minX, maxZ - minZ);
        boundingRect.endFill();
        boundingRect.zIndex = 15;
        if (globalThis.stageMap) {
            globalThis.stageMap.addChild(boundingRect);
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
            mapEdges[i].lineStyle(2, 0x000000, 1);
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

        // nodes

        const railMapNodes = map.getNodes();

        i = 0;
        for (; i < railMapNodes.length; i++) {
            if (!mapNodes[i]) {
                mapNodes[i] = new PIXI.Graphics();
                globalThis.stageMap.addChild(mapNodes[i]);
            }

            mapNodes[i].clear();
            mapNodes[i].lineStyle(0.25, 0x000000, 0.5);
            mapNodes[i].beginFill(0x00ff00);
            mapNodes[i].drawCircle(0, 0, railMapNodes[i].getType() === TYPES.PathBlock ? 2 : 5);
            mapNodes[i].endFill();
            mapNodes[i].zIndex = 9;
            mapNodes[i].x = railMapNodes[i].getCoord().x;
            mapNodes[i].y = railMapNodes[i].getCoord().z;
            mapNodes[i].renderable = true;
        }

        for (; i < mapNodes.length; i++) {
            mapNodes[i].renderable = false;
        }

        return map;
    }
}
