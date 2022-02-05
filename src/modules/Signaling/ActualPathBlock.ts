import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { PathBlock } from './PathBlock';
import { BlockJointEnd } from './BlockJointEnd';
import { PathBlockEnd } from './PathBlockEnd';
import { ActualPathBlockEnd } from './ActualPathBlockEnd';
import { DirectedTrack } from '../Track/DirectedTrack';
import { TrackSwitch } from '../Track/TrackSwitch';
import { Block } from './Block';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { AllowedPath } from './AllowedPath';
import { SignalSignal } from './SignalSignal';
import { Train } from '../Train/Train';
import { PathRule } from './PathRule';
import { PathQueue, persistBlockJointEnd, loadBlockJointEnd } from './PathQueue';
import { BlockJoint } from './BlockJoint';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Color } from '../../structs/Color';
import { PathRequest } from './PathRequest';
import { Station } from '../Station/Station';
import { DirectedBlock } from './DirectedBlock';
import { TrackDirection } from '../Track/TrackDirection';
import { BlockEnd } from './BlockEnd';

export interface ActualPathBlock extends Emitable { }
const doApply = () => applyMixins(ActualPathBlock, [Emitable]);
export class ActualPathBlock extends ActualBaseBrick implements PathBlock {
    private pathBlockEnds: PathBlockEnd[] = [];
    private allowedPathes: AllowedPath[] = [];
    private queue: PathQueue;
    private coord: Coordinate;
    private key: Record<string, number> = {};
    private light: boolean = false;
    private station: Station = null;

    init(jointEnds: BlockJointEnd[]): PathBlock {
        this.initStore(TYPES.PathBlock);

        this.queue = new PathQueue(this);

        this.pathBlockEnds = jointEnds.map(je => new ActualPathBlockEnd(je, this));

        for (let i = 0; i < this.pathBlockEnds.length; i++) {
            this.key[this.pathBlockEnds[i].getJointEnd().joint.getId() + '-' + this.pathBlockEnds[i].getJointEnd().end] = i;
        }

        this.coord = jointEnds.map(je => je.joint.getPosition().getRay().coord).reduce((a, b) => new Coordinate(a.x + b.x, a.y + b.y, a.z + b.z), new Coordinate(0, 0, 0));
        const n = jointEnds.length;
        this.coord = new Coordinate(this.coord.x / n, this.coord.y / n, this.coord.z / n);

        this.emit('init', this.persist());
        return this;
    }

    setStation(station: Station): void {
        this.station = station;
    }

    getStation(): Station {
        return this.station;
    }

    update(jointEnds: BlockJointEnd[]): void {

        this.pathBlockEnds = jointEnds.map(je => new ActualPathBlockEnd(je, this));

        this.key = {};
        for (let i = 0; i < this.pathBlockEnds.length; i++) {
            this.key[this.pathBlockEnds[i].getJointEnd().joint.getId() + '-' + this.pathBlockEnds[i].getJointEnd().end] = i;
        }

        this.coord = jointEnds.map(je => je.joint.getPosition().getRay().coord).reduce((a, b) => new Coordinate(a.x + b.x, a.y + b.y, a.z + b.z), new Coordinate(0, 0, 0));
        const n = jointEnds.length;
        this.coord = new Coordinate(this.coord.x / n, this.coord.y / n, this.coord.z / n);

        this.queue.updateRules(this.pathBlockEnds);

        this.emit('update', this.persist());
    }

    empty(): void {
        if (this.allowedPathes.length > 0) return;

        this.pathBlockEnds.map(pbe => pbe.pathDisconnect());
        this.pathBlockEnds = [];

        this.key = {};

        this.emit('update', this.persist());
    }

    remove() {
        if (this.allowedPathes.length > 0) return;

        this.pathBlockEnds.map(pbe => pbe.pathDisconnect());
        this.emit('remove', this.id);
        super.remove();
    }

    highlight(light: boolean): void {
        this.light = light;
        this.emit('update', this.persist());
    }

    getName(): string {
        return this.id;
    }

    getCoord(): Coordinate {
        return this.coord;
    }

    getPathBlockEnds(): PathBlockEnd[] {
        return this.pathBlockEnds;
    }

    allow(
        startPathBlockEnd: PathBlockEnd,
        endPathBlockEnd: PathBlockEnd,
        request: PathRequest,
        train: Train,
        count: number = 1
    ): boolean {
        const found = this.allowedPathes.find(
            ap =>
                ap.startPathBlockEnd === startPathBlockEnd ||
                ap.startPathBlockEnd === endPathBlockEnd ||
                ap.endPathBlockEnd === startPathBlockEnd ||
                ap.endPathBlockEnd === endPathBlockEnd
        );
        if (found) return false;
        const other = endPathBlockEnd.getJointEnd().joint.getEnd(endPathBlockEnd.getJointEnd().end === WhichEnd.A ? WhichEnd.B : WhichEnd.A);
        const otherSeg = endPathBlockEnd.getJointEnd().joint.getSectionEnd(endPathBlockEnd.getJointEnd().end === WhichEnd.A ? WhichEnd.B : WhichEnd.A);
        const otherCap = endPathBlockEnd.getJointEnd().joint.getCapacityCap(endPathBlockEnd.getJointEnd().end === WhichEnd.A ? WhichEnd.B : WhichEnd.A);
        if (other?.getSignal() === SignalSignal.Red) return false;
        if (otherSeg?.getSignal() === SignalSignal.Red) return false;
        if (otherCap?.getSignal() === SignalSignal.Red) return false;

        const startDt: DirectedTrack = startPathBlockEnd
            .getJointEnd()
            .joint.getPosition()
            .getDirectedTrack();
        const endDt: DirectedTrack = endPathBlockEnd
            .getJointEnd()
            .joint.getPosition()
            .getDirectedTrack();

        const queue: DirectedTrack[] = [];
        const info: Record<string, any> = {};
        queue.push(startDt);
        queue.push(startDt.reverse());
        info[startDt.getHash()] = null;
        info[startDt.reverse().getHash()] = null;

        let backFromHere: DirectedTrack = null;

        while (queue.length > 0) {
            const dt = queue.shift();

            if (dt === endDt || dt === endDt.reverse()) {
                backFromHere = dt;
                break;
            }

            for (let next of dt.permaNexts()) {
                if (
                    next.getTrack().getType() === TYPES.TrackSwitch &&
                    (next.getTrack() as TrackSwitch).isLocked()
                ) {
                    // then skip
                } else {
                    queue.push(next);
                    if (!info[next.getHash()]) {
                        info[next.getHash()] = dt;
                    }
                }
            }
        }

        const switches: TrackSwitch[] = [];
        const preSwitches: TrackSwitch[] = [];
        if (backFromHere) {
            // todo remove this hotfix when fixed properly
            let preNext: DirectedTrack = backFromHere;
            this.preHandle(preNext, preSwitches);
            while ((preNext = info[preNext.getHash()])) {
                this.preHandle(preNext, preSwitches);
            }
            if (preSwitches.length > 10) return false;
            // todo end of hotfix

            let next: DirectedTrack = backFromHere;
            this.handle(next, switches, train);
            while ((next = info[next.getHash()])) {
                this.handle(next, switches, train);
            }

            const block = this.store.create<Block>(TYPES.Block).init({
                startJointEnd: startPathBlockEnd.getJointEnd(),
                endJointEnd: endPathBlockEnd.getJointEnd()
            });

            const allowedPath: AllowedPath = {
                startPathBlockEnd,
                endPathBlockEnd,
                switches,
                block,
                count,
                request
            };

            this.allowBlock(allowedPath);
            this.allowedPathes.push(allowedPath);

            if (train && otherSeg) {
                otherSeg.checkin(train);
            }
        }

        if (!!backFromHere) {
            const station = train.getTrips()?.[0].getNextStation();
            // console.log('names', station?.getName(), this.station?.getName());
            if (station && this.station) {
                let start: DirectedBlock = endPathBlockEnd.getOtherEnd().getStart();
                let nextOtherEnd: BlockEnd = null;
                let oneAheadEnd: BlockEnd = endPathBlockEnd;

                let otherSide: PathBlock = null;

                while (start) {
                    const nextEnd = start
                        .getBlock()
                        .getEnd(
                            start.getDirection() === TrackDirection.AB
                                ? WhichEnd.B
                                : WhichEnd.A
                        );
                    oneAheadEnd = nextEnd;
                    nextOtherEnd = nextEnd.getOtherEnd();

                    // todo cannot expect there is blockEnd everywhere
                    if (nextOtherEnd?.getType() === TYPES.PathBlockEnd) {
                        otherSide = (nextOtherEnd as PathBlockEnd).getPathBlock();
                        break;
                    }

                    start = start.next();
                }

                if (otherSide?.getStation() === this.station) {
                    if (station === this.station) {
                        console.log('allowing - stopping station');
                    } else {
                        otherSide?.requestPath(nextOtherEnd as PathBlockEnd, train);
                        console.log('allowing - going through');
                    }
                } else {
                    console.log('allowing - leaving')
                }
            } else {
                console.log('allowing - no station info');
            }
        }

        return !!backFromHere;
    }

    private allowBlock(allowedPath: AllowedPath) {
        allowedPath.startPathBlockEnd.setBlockEnd(allowedPath.block.getEnd(WhichEnd.A));
        allowedPath.endPathBlockEnd.setBlockEnd(allowedPath.block.getEnd(WhichEnd.B));
        allowedPath.startPathBlockEnd.pathConnect();
        allowedPath.endPathBlockEnd.pathConnect();

        allowedPath.startPathBlockEnd.setGreen();
    }

    checkout(endPathBlockEnd: PathBlockEnd): void {
        const allowedPath = this.allowedPathes.find(
            x =>
                x.endPathBlockEnd === endPathBlockEnd ||
                x.startPathBlockEnd === endPathBlockEnd
        );
        if (allowedPath) {
            allowedPath.count--;
            if (allowedPath.count < 1) {
                allowedPath.block.getSegment().disconnect();
                allowedPath.block.remove();
                allowedPath.startPathBlockEnd.setBlockEnd(null);
                allowedPath.endPathBlockEnd.setBlockEnd(null);
                allowedPath.startPathBlockEnd.pathConnect();
                allowedPath.endPathBlockEnd.pathConnect();
                allowedPath.switches.map(s => s.unlock());
                this.allowedPathes = this.allowedPathes.filter(x => x !== allowedPath);
            }
        }
    }

    addRule(rule: PathRule): void {
        this.queue.addRule(rule);

        this.emit('info', this.persist());
    }

    removeRule(index: number): void {
        this.queue.removeRule(index);

        this.emit('info', this.persist());
    }

    setFilterToRule(index: number, filter: string): void {
        this.queue.setFilterToRule(index, filter);

        this.emit('info', this.persist());
    }

    requestPath(pathBlockEnd: PathBlockEnd, train: Train): void {
        if (this.allowedPathes.some(ap => ap.request.train === train)) return;
        if (this.queue.getQueue().some(rq => rq.train === train)) return;

        this.queue.push(pathBlockEnd, train);
    }

    tick(): void {
        this.queue.evaluate();
    }

    private handle(dt: DirectedTrack, switches: TrackSwitch[], train: Train): void {
        const track = dt.getTrack();
        if (track.getType() === TYPES.TrackSwitch) {
            if (track.getActiveSegment() !== dt.getSegment()) {
                (track as TrackSwitch).switch();
            }
            (track as TrackSwitch).lock(train.getId());
            switches.push(track as TrackSwitch);
        }
    }

    private preHandle(dt: DirectedTrack, switches: TrackSwitch[]): void {
        const track = dt.getTrack();
        if (track.getType() === TYPES.TrackSwitch) {
            switches.push(track as TrackSwitch);
        }
    }

    getRenderer(): BaseRenderer {
        throw new Error('Method not implemented.');
    }

    persist(): Object {
        return {
            id: this.getId(),
            type: 'PathBlock',
            jointEnds: this.pathBlockEnds.map(pbe => persistBlockJointEnd(pbe.getJointEnd())),
            queue: this.queue.persist(),
            allowedPathes: this.allowedPathes.map(this.persistAllowedPath),
            coord: { x: this.getCoord().x, y: this.getCoord().y, z: this.getCoord().z },
            key: this.key,
            light: this.light,
            station: this.station?.getId()
        };
    }

    persistShallow(): Object {
        return {
            id: this.id,
            type: 'PathBlock',
            name: this.id
        };
    }

    getColor(): Color {
        return new Color(0, 0, 0);
    }

    private persistAllowedPath(allowedPath: AllowedPath): any {
        return {
            block: allowedPath.block.getId(),
            count: allowedPath.count,
            switches: allowedPath.switches.map(sw => sw.getId()),
            startPathBlockEnd: allowedPath.startPathBlockEnd.persist(),
            endPathBlockEnd: allowedPath.endPathBlockEnd.persist(),
            request: persistRequest(allowedPath.request)
        };
    }

    private loadAllowedPath(obj: any, store: Store): AllowedPath {
        return {
            block: store.get(obj.block) as Block,
            count: obj.count,
            switches: obj.switches.map(sw => store.get(sw) as TrackSwitch),
            startPathBlockEnd: loadPathBlockEnd(obj.startPathBlockEnd, store),
            endPathBlockEnd: loadPathBlockEnd(obj.endPathBlockEnd, store),
            request: loadRequest(obj.request, store)
        };
    }

    load(obj: any, store: Store): void {
        this.presetId(obj.id);
        this.init(obj.jointEnds.map(je => loadBlockJointEnd(je, store)));
        this.getPathBlockEnds().map(pbe => pbe.pathConnect());

        this.queue.load(obj.queue, store);
        this.allowedPathes = obj.allowedPathes.map(ap => this.loadAllowedPath(ap, store));
        this.allowedPathes.map(this.allowBlock);

        setTimeout(() => {
            if (obj.station) {
                const loaded = store.get(obj.station) as Station;
                this.setStation(loaded);
            }
        }, 0);
    }
}
doApply();

export const loadPathBlockEnd = (obj: any, store: Store): PathBlockEnd => {
    const joint = store.get(obj.joint) as BlockJoint;
    return joint.getEnd(obj.end) as PathBlockEnd;
};

const persistRequest = (request: PathRequest): any => {
    return {
        from: request.from.persist(),
        toOptions: request.toOptions.map(t => t.persist()),
        train: request.train.getId()
    }
};

const loadRequest = (obj: any, store: Store): PathRequest => {
    return {
        from: loadPathBlockEnd(obj.from, store),
        toOptions: obj.toOptions.map(t => loadBlockJointEnd(t, store)),
        train: store.get(obj.train) as Train
    }
};
