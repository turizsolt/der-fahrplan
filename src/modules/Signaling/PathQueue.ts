import { PathRule } from './PathRule';
import { PathRequest } from './PathRequest';
import { PathBlockEnd } from './PathBlockEnd';
import { Train } from '../Train/Train';
import { PathBlock } from './PathBlock';
import { BlockJointEnd } from './BlockJointEnd';
import { Store } from '../../structs/Interfaces/Store';
import { BlockJoint } from './BlockJoint';
import { BlockEnd } from './BlockEnd';

export class PathQueue {
  private rules: PathRule[] = [];
  private queue: PathRequest[] = [];

  constructor(private pathBlock: PathBlock) { }

  push(pathBlockEnd: PathBlockEnd, train: Train) {
    const found = this.rules.find(
      r =>
        r.from === pathBlockEnd &&
        (!r.filter ||
          r.filter ===
          train
            ?.getTrips()[0]
            ?.getRoute()
            ?.getName())
    );
    if (found) {
      this.queue.push({
        from: pathBlockEnd,
        train,
        toOptions: found.toOptions
      });
    }
  }

  getQueue(): PathRequest[] {
    return this.queue;
  }

  evaluate() {
    const toEval = [...this.queue];
    this.queue = [];

    const dict: Record<string, boolean> = {};

    for (let next of toEval) {
      let succ = false;

      if (!dict[next.from.getHash()]) {
        for (let to of next.toOptions) {
          if (this.pathBlock.allow(next.from, to, next, next.train)) {
            succ = true;
            dict[next.from.getHash()] = true;
            break;
          }
        }
      }
      dict[next.from.getHash()] = true;

      if (!succ) {
        this.queue.push(next);
      }
    }
  }

  addRule(rule: PathRule) {
    this.rules.push(rule);
  }

  removeRule(index: number): void {
    this.rules.splice(index, 1);
  }

  setFilterToRule(index: number, filter: string): void {
    this.rules[index].filter = filter;
  }

  updateRules(jointEnds: PathBlockEnd[]): void {
    const newRules: PathRule[] = [];
    for (let rule of this.rules) {
      if (jointEnds.some(je => je.getHash() === rule.from.getHash())) {
        const toOptions: PathBlockEnd[] = [];
        for (let to of rule.toOptions) {
          if (jointEnds.some(je => je.getHash() === to.getHash())) {
            toOptions.push(to);
          }
        }
        if (toOptions.length > 0) {
          newRules.push({ from: rule.from, toOptions, filter: rule.filter });
        }
      }
    }

    this.rules = newRules;
  }

  persist(): Object {
    return {
      rules: this.rules.map(r => ({
        filter: r.filter,
        from: persistPathBlockEnd(r.from),
        toOptions: r.toOptions.map(o => persistPathBlockEnd(o))
      })),
      queue: this.queue.map(r => ({
        from: persistPathBlockEnd(r.from),
        toOptions: r.toOptions.map(o => persistPathBlockEnd(o)),
        train: r.train.getId()
      }))
    };
  }

  load(obj: any, store: Store): void {
    this.rules = obj.rules.map(r => ({
      filter: r.filter,
      from: loadPathBlockEnd(r.from, store),
      toOptions: r.toOptions.map(o => loadPathBlockEnd(o, store))
    }));
    this.queue = obj.queue.map(r => ({
      from: loadPathBlockEnd(r.from, store),
      toOptions: r.toOptions.map(o => loadPathBlockEnd(o, store)),
      train: store.get(r.train) as Train
    }));
  }
}

export const persistBlockJointEnd = (bje: BlockJointEnd): any => {
  return {
    joint: bje.joint.getId(),
    end: bje.end,
    ray: bje.joint
      .getPosition()
      .getRay()
      .persist()
  };
};

export const loadBlockJointEnd = (obj: any, store: Store): BlockJointEnd => {
  const joint = store.get(obj.joint) as BlockJoint;
  return { joint, end: obj.end };
};

export const persistPathBlockEnd = (bje: BlockEnd): any => {
  return {
    joint: bje.getJointEnd().joint.getId(),
    end: bje.getJointEnd().end
  };
};

export const loadPathBlockEnd = (obj: any, store: Store): BlockEnd => {
  const joint = store.get(obj.joint) as BlockJoint;
  return joint.getEnd(obj.end);
};
