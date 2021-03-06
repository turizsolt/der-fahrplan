import { WhichEnd } from '../Interfaces/WhichEnd';

interface BasicEndOf {
  update: () => void;
  getId: () => string;
}

export class End<EndOf extends BasicEndOf> {
  protected whichEnd: WhichEnd;
  protected endOf: EndOf;
  protected connectedEnd: End<EndOf>;

  constructor(which: WhichEnd, endOf: EndOf) {
    this.whichEnd = which;
    this.endOf = endOf;
  }

  connect(otherEnd: End<EndOf>): boolean {
    if (this.connectedEnd) {
      return false;
    }

    this.connectedEnd = otherEnd;

    if (!otherEnd.isConnectedTo(this)) {
      otherEnd.connect(this);
    }

    this.endOf.update();
    return true;
  }

  isConnectedTo(otherEnd: End<EndOf>) {
    return this.connectedEnd === otherEnd;
  }

  disconnect(): boolean {
    if (!this.connectedEnd) return false;

    const temp = this.connectedEnd;
    this.connectedEnd = null;
    if (temp.isConnectedTo(this)) {
      temp.disconnect();
    }

    this.endOf.update();
    return true;
  }

  remove() {
    this.disconnect();
  }

  update() {
    this.endOf.update();
  }

  getEndOf(): EndOf {
    return this.endOf;
  }

  getConnectedEndOf(): EndOf {
    if (this.hasConnectedEndOf()) {
      return this.connectedEnd.getEndOf();
    }
    return null;
  }

  hasConnectedEndOf(): boolean {
    return !!this.connectedEnd;
  }

  getConnectedEnd(): End<EndOf> {
    return this.connectedEnd;
  }

  getWhichEnd(): WhichEnd {
    return this.whichEnd;
  }

  isSwitchingEnds(): boolean {
    if (!this.getConnectedEnd()) return null;
    return this.getWhichEnd() !== this.getConnectedEnd().getWhichEnd();
  }

  getHash(): string {
    return this.whichEnd + this.endOf.getId();
  }

  persist(): Object {
    return {
      whichEnd: this.whichEnd,
      endOf: this.endOf.getId()
    };
  }
}
