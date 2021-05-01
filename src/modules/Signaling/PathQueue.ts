import { PathRule } from './PathRule';
import { PathRequest } from './PathRequest';
import { PathBlockEnd } from './PathBlockEnd';
import { Train } from '../Train/Train';
import { PathBlock } from './PathBlock';

export class PathQueue {
  private rules: PathRule[] = [];
  private queue: PathRequest[] = [];

  constructor(private pathBlock: PathBlock) {}

  push(pathBlockEnd: PathBlockEnd, train: Train) {
    const found = this.rules.find(r => r.from === pathBlockEnd);
    if (found) {
      this.queue.push({
        from: pathBlockEnd,
        train,
        toOptions: found.toOptions
      });
    }
  }

  evaluate() {
    const toEval = [...this.queue];
    this.queue = [];

    for (let next of toEval) {
      let succ = false;
      for (let to of next.toOptions) {
        if (this.pathBlock.allow(next.from, to)) {
          succ = true;
          break;
        }
      }

      if (!succ) {
        this.queue.push(next);
      }
    }
  }

  addRule(rule: PathRule) {
    this.rules.push(rule);
  }
}
