import { Train } from '../../Train/Train';
import { Emitable } from '../../../mixins/Emitable';
import { SignalSignal } from '../SignalSignal';
import { BlockJointEnd } from '../BlockJointEnd';
import { CapacityCap } from './CapacityCap';
import { TYPES } from '../../../di/TYPES';
import { applyMixins } from '../../../mixins/ApplyMixins';
import { Store } from '../../../structs/Interfaces/Store';
import { ActualBaseBrick } from '../../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../../structs/Renderers/BaseRenderer';
import { BlockJoint } from '../BlockJoint';
import { Ray } from '../../../structs/Geometry/Ray';
import { PositionOnTrack } from '../../Train/PositionOnTrack';
import { WhichEnd } from '../../../structs/Interfaces/WhichEnd';

export interface ActualCapacityCap extends Emitable { }
const doApply = () => applyMixins(ActualCapacityCap, [Emitable]);
export class ActualCapacityCap extends ActualBaseBrick implements CapacityCap {
    private cap: number = 1;
    private trainCount: number = 0;
    private signal: SignalSignal = SignalSignal.Red;
    private jointEnds: BlockJointEnd[] = [];
    private jointRays: Ray[] = [];

    init(jointEnds: BlockJointEnd[]): CapacityCap {
        this.initStore(TYPES.CapacityCap);

        this.jointEnds = jointEnds;
        this.updateSignal();

        this.jointEnds.map(j => j.joint.setOneCapacityCap(j.end, this));

        this.jointRays = this.jointEnds.map(je => {
            const pos: PositionOnTrack = je.joint.getPosition().clone();
            if (je.end === WhichEnd.A) {
                pos.reverse();
            }
            pos.move(13);
            return pos.getRay();
        });

        this.emit('init', this.persist());

        return this;
    }

    remove() {
        this.signal = SignalSignal.Green;
        this.getJointEnds().map(je => je.joint.removeCapacityCap(this));
        this.emit('update', this.persist());
        this.emit('remove', this.id);
        super.remove();
    }

    getJointEnds(): BlockJointEnd[] {
        return this.jointEnds;
    }

    getType() {
        return TYPES.CapacityCap;
    }

    checkin(train: Train): void {
        this.trainCount++;
        this.updateSignal();
        this.emit('update', this.persist());
    }

    checkout(train: Train): void {
        this.trainCount--;
        this.updateSignal();
        this.emit('update', this.persist());
    }

    isFree(): boolean {
        return this.trainCount < this.cap;
    }

    updateSignal(): void {
        this.signal = this.isFree() ? SignalSignal.Green : SignalSignal.Red;
    }

    getSignal(): SignalSignal {
        return this.signal;
    }

    setTrainCount(trainCount: number): void {
        this.trainCount = trainCount;
    }

    setCap(cap: number): void {
        this.cap = cap;
    }

    getRenderer(): BaseRenderer {
        throw new Error('Method not implemented.');
    }

    persist() {
        return {
            id: this.id,
            type: 'CapacityCap',
            isFree: this.isFree,
            signal: this.signal,
            cap: this.cap,
            trainCount: this.trainCount,
            jointEnds: this.jointEnds.map(j => ({
                joint: j.joint.getId(),
                end: j.end
            })),
            rays: this.jointRays.map(r => r.persist())
        }
    }

    load(obj: any, store: Store): void {
        this.presetId(obj.id);

        this.init(obj.jointEnds.map(j => ({
            joint: store.get(j.joint) as BlockJoint,
            end: j.end
        })));
        this.setTrainCount(obj.trainCount);
        this.setCap(obj.cap);
        this.updateSignal();
        this.emit('update', this.persist());
    }
}
doApply();
