import {Track} from "./Track";
import {TrackEnd} from "./TrackEnd";

export type TrackCreatorList = TrackCreatorListElement[];

export interface TrackCreatorListElement {
    x: number,
    z: number,
    im?: boolean,
}

export class TrackList {
    readonly list: Track[];

    constructor(creatorList: TrackCreatorList) {
        this.list = [];

        const length = creatorList.length;
        let i = 0;
        for (;i < length;) {
            const tempList = [creatorList[i]];
            if (i + 1 < length) {
                tempList.push(creatorList[i + 1]);
                if (creatorList[i + 1].im && i + 2 < length) {
                    tempList.push(creatorList[i + 2]);
                    if (creatorList[i + 2].im) {
                        throw new Error("TrackList: im, im in a row");
                    }
                }
            }

            if (tempList.length === 2) {
                this.list.push(new Track(tempList[0], tempList[1]));
            } else if (tempList.length === 3) {
                    this.list.push(new Track(tempList[0], tempList[2], tempList[1]));
            } else {
                break;
            }

            i += tempList.length - 1;
        }

        for(let j = 1; j < this.list.length; j++) {
            TrackList.connect(this.list[j-1].B, this.list[j].A);
        }
    }

    static connect(a: TrackEnd, b: TrackEnd) {
        a.connect(b);
    }
}
