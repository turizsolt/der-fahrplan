import { Train } from '../../Train/Train';
import { Emitable } from '../../../mixins/Emitable';
import { SignalSignal } from '../SignalSignal';
import { BlockJointEnd } from '../BlockJointEnd';
import { BaseBrick } from '../../../structs/Interfaces/BaseBrick';

export interface CapacityCap extends BaseBrick, Emitable {
    init(jointEnds: BlockJointEnd[]): CapacityCap;
    getJointEnds(): BlockJointEnd[];
    persist(): any;
    checkin(train: Train): void;
    checkout(train: Train): void;
    isFree(): boolean;
    getSignal(): SignalSignal;
    setTrainCount(trainCount: number): void;
    setCap(cap: number): void;
}
