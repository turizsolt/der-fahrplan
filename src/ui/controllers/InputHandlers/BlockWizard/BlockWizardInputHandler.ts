import { InputHandler } from '../InputHandler';
import { click, roam } from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { InputProps } from '../../InputProps';
import { CommandLog } from '../../../../structs/Actuals/Store/Command/CommandLog';
import { BlockWizardInputHandlerPlugin } from './BlockWizardInputHandlerPlugin';
import { BlockWizardInputHandlerPixi } from './BlockWizardInputHandlerPixi';
import { BlockWizardInputHandlerBabylon } from './BlockWizardInputHandlerBabylon';
import { ActualTrack } from '../../../../modules/Track/ActualTrack';
import { PositionOnTrack } from '../../../../modules/Train/PositionOnTrack';
import { TrackDirection } from '../../../../modules/Track/TrackDirection';
import { ActualTrackSwitch } from '../../../../modules/Track/ActualTrackSwitch';
import { Nearest } from '../../../../modules/Train/Nearest';
import { WhichEnd } from '../../../../structs/Interfaces/WhichEnd';
import { BlockJoint } from '../../../../modules/Signaling/BlockJoint';
import { TYPES } from '../../../../di/TYPES';
import { Signal } from '../../../../modules/Signaling/Signal';
import { Block } from '../../../../modules/Signaling/Block';
import { Section } from '../../../../modules/Signaling/Section';
import { BlockJointEnd } from '../../../../modules/Signaling/BlockJointEnd';
import { SignalSignal } from '../../../../modules/Signaling/SignalSignal';
import { TrackBase } from '../../../../modules/Track/TrackBase';
import { TrackSwitch } from '../../../../modules/Track/TrackSwitch';
import { DirectedTrack } from '../../../../modules/Track/DirectedTrack';
import { MarkerIterator } from '../../../../modules/Train/MarkerIterator';
import { PathBlock } from '../../../../modules/Signaling/PathBlock';
import { Sensor } from '../../../../modules/Signaling/Sensor';
import { convertFrom, convertTo } from '../../../../modules/Train/ActualTrain';
import { SectionEnd } from '../../../../modules/Signaling/SectionEnd';
import { ActualTrainSight } from '../../../../modules/Train/Sight/ActualTrainSight';
import { Util } from '../../../../structs/Util';

// @injectable()
export class BlockWizardInputHandler extends InputHandler {
    private commandLog: CommandLog;

    // @inject(TYPES.TrackInputHandler)
    private plugin: BlockWizardInputHandlerPlugin;

    constructor(private store: Store) {
        super();

        // todo inject
        this.plugin =
            globalThis.startParam === '2d'
                ? new BlockWizardInputHandlerPixi()
                : new BlockWizardInputHandlerBabylon();
        this.plugin.init();
        this.commandLog = store.getCommandLog();

        this.reg(click(), (legacyEvent: PointerEvent) => {
            const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
            const dpot = legacyProps.snappedPositionOnTrack;
            const position =
                dpot &&
                PositionOnTrack.fromTrack(
                    dpot.track,
                    dpot.track.getLength() * dpot.position,
                    TrackDirection.AB
                );

            if (dpot && dpot.track.constructor.name === ActualTrack.name) {
                this.wizardBlock(position);
            } else if (
                dpot &&
                dpot.track.constructor.name === ActualTrackSwitch.name
            ) {
                this.wizardPathBlock(position);
            }

            this.plugin.click();
        });

        this.reg(roam(), (legacyEvent: PointerEvent) => {
            const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
            const pot = legacyProps.snappedPositionOnTrack;
            if (
                pot &&
                (pot.track.constructor.name === ActualTrack.name ||
                    pot.track.constructor.name === ActualTrackSwitch.name)
            ) {
                const point = pot.track
                    .getCurve()
                    .getBezier()
                    .getPoint(pot.position);

                this.plugin.roam(!!pot, point);
            } else {
                this.plugin.roam(false);
            }
        });
    }

    wizardBlock(position: PositionOnTrack): void {
        const opposition = position.opposition();

        const nearestForward = Nearest.blockJoint(position);
        const nearestBackward = Nearest.blockJoint(opposition);
        const nearestEndForward = Nearest.singleEnd(position);
        const nearestEndBackward = Nearest.singleEnd(opposition);

        if (nearestEndForward.distance < nearestForward.distance) {
            nearestEndForward.blockJoint = this.store
                .create<BlockJoint>(TYPES.BlockJoint)
                .init(nearestEndForward.position);
        }

        const forward =
            nearestEndForward.distance < nearestForward.distance
                ? nearestEndForward
                : nearestForward;

        if (nearestEndBackward.distance < nearestBackward.distance) {
            nearestEndBackward.blockJoint = this.store
                .create<BlockJoint>(TYPES.BlockJoint)
                .init(nearestEndBackward.position);
        }

        const backward =
            nearestEndBackward.distance < nearestBackward.distance
                ? nearestEndBackward
                : nearestBackward;

        const wholeDistance = forward.distance + backward.distance;
        const signalMinimumDistance = 100;
        const signalCount = Math.max(
            1,
            Math.floor(wholeDistance / signalMinimumDistance)
        );
        const signalPlantingDistance = wholeDistance / signalCount;

        const pos = backward.position.opposition();
        const joints = [] as BlockJointEnd[];
        let i = 0;
        joints.push({
            joint: backward.blockJoint,
            end: convertFrom(backward.blockJoint, backward.position.opposition())
        });

        for (i = 1; i < signalCount; i++) {
            pos.move(signalPlantingDistance);
            const joint = this.store
                .create<BlockJoint>(TYPES.BlockJoint)
                .init(pos.clone());
            joints.push({ joint, end: WhichEnd.A });
            joints.push({ joint, end: WhichEnd.B });
        }
        joints.push({
            joint: forward.blockJoint,
            end: convertTo(forward.blockJoint, forward.position)
        });

        const section = this.store
            .create<Section>(TYPES.Section)
            .init(joints[0], joints[joints.length - 1]);
        section.connect();
        createSignals([joints[0], joints[joints.length - 1]], SignalSignal.Green, this.store);

        const blocks = [] as Block[];
        for (i = 0; i < joints.length; i += 2) {
            const block = this.store.create<Block>(TYPES.Block).init({
                startJointEnd: joints[i],
                endJointEnd: joints[i + 1]
            });
            blocks.push(block);
            block.getSegment().connect();
            createSignals([joints[i], joints[i + 1]], SignalSignal.Green, this.store, joints);
        }
    }

    wizardPathBlock(position: PositionOnTrack): void {
        const track: TrackBase = position.getTrack();
        const queue: TrackBase[] = [track];
        const visited: Record<string, DirectedTrack> = { [track.getId()]: position.getDirectedTrack() };
        const blockJointEnds: BlockJointEnd[] = [];

        while (queue.length > 0) {
            const next: TrackBase = queue.shift();

            if (next.getType() === TYPES.TrackSwitch) {
                const ts = next as TrackSwitch;
                const dts: DirectedTrack[] = ts.getAdjacentDirectedTracks();
                for (const dt of dts) {
                    const track = dt.getTrack();

                    if (!visited[track.getId()]) {
                        visited[track.getId()] = dt;
                        queue.push(track);
                    }
                }
            } else if (next.getType() === TYPES.Track) {
                const dt = visited[next.getId()];
                const iter = new MarkerIterator(dt, undefined, undefined, undefined, (dt) => dt?.getTrack().getType() === TYPES.Track);
                const ret = iter.nextOfFull('BlockJoint');

                if (ret.value) {
                    blockJointEnds.push({ joint: ret.value.blockJoint, end: convertTo(ret.value.blockJoint, ret.positionOnTrack) });
                }
            }
        }

        //
        const pb = this.store
            .create<PathBlock>(TYPES.PathBlock)
            .init(blockJointEnds);

        // connect all
        pb.getPathBlockEnds().map(pbe => pbe.pathConnect());

        // create sensors
        pb.getPathBlockEnds().map(pbe => {
            const bj = pbe.getJointEnd().joint;
            const pot = bj.getPosition().clone();
            if (pbe.getJointEnd().end === WhichEnd.B) {
                pot.reverse();
            }

            const sight = new ActualTrainSight();
            const distance: number = sight.distanceWithoutSwitchprivate(pot, 160) - 1;

            // console.log('dist', distance);

            pot.move(distance);
            pot.reverse();

            const nearestData = Nearest.platform(pot.clone());
            if (nearestData?.distance < distance) {
                this.store.create<Sensor>(TYPES.Sensor).init(nearestData.position, pb, pbe);

            } else {
                this.store.create<Sensor>(TYPES.Sensor).init(pot, pb, pbe);
            }
            /*
            pot.move(160);
            pot.reverse();

            const sight = new ActualTrainSight();
            const nearestPlatformList = sight.getSight(pot, 160, null, null).markers
                .filter(m => m.type === 'Platform');;
            
            if (nearestPlatformList.length > 0) {
                pot.move(Util.last(nearestPlatformList).distance);
                this.store.create<Sensor>(TYPES.Sensor).init(pot, pb, pbe);
            } else {
                this.store.create<Sensor>(TYPES.Sensor).init(pot, pb, pbe);
            }
            */
        });

        // create signals
        createSignals(blockJointEnds, SignalSignal.Red, this.store);
    }
}

function createSignals(jointEnds: BlockJointEnd[], startSignal: SignalSignal, store: Store, wholeJointEnds?: BlockJointEnd[]) {
    jointEnds.map((x, ind) => {
        const position = x.joint.getPosition().clone();
        if (x.end === WhichEnd.A) {
            position.reverse();
        }

        const dt = position.getDirectedTrack();
        const pos = position.getPosition();
        const signal: Signal = dt
            .getMarkers()
            .find(m => m.marker.type === 'Signal' && m.position === pos)?.marker.signal;

        // set inner signals also red, if the entry signal is red in the section
        let altSection: SectionEnd = null;
        if (wholeJointEnds) {
            const section0 = wholeJointEnds?.[0].joint.getSectionEnd(wholeJointEnds?.[0].end);
            const n = wholeJointEnds.length - 1;
            const section1 = wholeJointEnds?.[n].joint.getSectionEnd(wholeJointEnds?.[n].end);

            altSection = (ind % 2 === 0 && section0) || (ind % 2 === 1 && section1);
        }
        const sectionEnd = x.joint.getSectionEnd(x.end) || altSection;
        const blockEnd = x.joint.getEnd(x.end);

        if (signal) {
            if (sectionEnd) {
                signal.addSectionEmitter(sectionEnd);
            }
            if (blockEnd) {
                signal.addBlockEmitter(blockEnd);
            }
        } else {
            store
                .create<Signal>(TYPES.Signal)
                .init(position, blockEnd, sectionEnd, startSignal);
        }
    });
}
