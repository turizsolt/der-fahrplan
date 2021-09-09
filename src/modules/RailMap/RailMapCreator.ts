import { TYPES } from '../../di/TYPES';
import { Store } from '../../structs/Interfaces/Store';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { Station } from '../../structs/Scheduling/Station';
import { BlockEnd } from '../Signaling/BlockEnd';
import { DirectedBlock } from '../Signaling/DirectedBlock';
import { PathBlock } from '../Signaling/PathBlock';
import { PathBlockEnd } from '../Signaling/PathBlockEnd';
import { TrackDirection } from '../Track/TrackDirection';
import { ActualRailMap } from './ActualRailMap';
import { RailMap } from './RailMap';
import { RailMapNode } from './RailMapNode';

export class RailMapCreator {
  static create(store: Store): RailMap {
    const pathBlocks = store.getAllOf(TYPES.PathBlock) as PathBlock[];
    const stations = (store.getAllOf(TYPES.Station) as Station[]);

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

    return map;
  }
}
