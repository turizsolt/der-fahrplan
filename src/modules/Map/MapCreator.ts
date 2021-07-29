import { TYPES } from "../../di/TYPES";
import { Store } from "../../structs/Interfaces/Store";
import { WhichEnd } from "../../structs/Interfaces/WhichEnd";
import { BlockEnd } from "../Signaling/BlockEnd";
import { DirectedBlock } from "../Signaling/DirectedBlock";
import { PathBlock } from "../Signaling/PathBlock";
import { TrackDirection } from "../Track/TrackDirection";

export class MapCreator {
    static create(store: Store) {
        const pathBlocks = store.getAllOf(TYPES.PathBlock) as PathBlock[];
        if (pathBlocks.length === 0) {
            console.log('no pathblocks yet');
            return;
        }

        const pathBlock = pathBlocks[0];
        for (let end of pathBlock.getPathBlockEnds()) {
            let start: DirectedBlock = end.getOtherEnd().getStart();
            let nextOtherEnd: BlockEnd = null;

            // find next PathBlock
            while (true) {
                if (!start) break;

                // get markers
                // console.log('track', start.getTrackParts());
                // console.log('markers', start.getMarkers());

                const markers = start.getMarkers();
                const filteredMarkers = markers.filter(m => m.marker.type === 'Platform');
                // console.log('markers', markers, filteredMarkers);
                console.log('Stations:', filteredMarkers.map(m => m.marker.platform.getStation()?.getName()));

                const nextEnd = start.getBlock().getEnd(start.getDirection() === TrackDirection.AB ? WhichEnd.B : WhichEnd.A);
                nextOtherEnd = nextEnd.getOtherEnd();
                if (!nextOtherEnd) break;
                console.log(nextOtherEnd.getType(), nextOtherEnd.getHash());
                if (nextOtherEnd.getType() === TYPES.PathBlockEnd) break;
                start = start.next();
            }
            console.log('FOUND', nextOtherEnd?.getType(), nextOtherEnd?.getHash());
        }
    }
}
