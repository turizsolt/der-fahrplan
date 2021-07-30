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
        let start: DirectedBlock = end.getOtherEnd().getStart();
        let nextOtherEnd: BlockEnd = null;
        let oneAheadEnd: BlockEnd = end;

        // find next PathBlock
        const nodes: RailMapNode[] = [pathBlock];
        while (true) {
          if (!start) break;

          // get markers
          const markers = start.getMarkers();
          const filteredMarkers = markers.filter(
            m => m.marker.type === 'Platform'
          );
          nodes.push(
            ...filteredMarkers.map(m => m.marker.platform.getStation())
          );

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
          nodes.push((nextOtherEnd as PathBlockEnd).getPathBlock());
          for (let i = 1; i < nodes.length; i++) {
            map.addEdge(nodes[i - 1], nodes[i], 0.5);
          }
        } else {
          // todo push a deadend node
          for (let i = 1; i < nodes.length; i++) {
            map.addEdge(nodes[i - 1], nodes[i]);
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
