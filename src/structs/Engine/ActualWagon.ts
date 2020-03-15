import { inject, injectable } from 'inversify';
import { PositionOnTrack } from './PositionOnTrack';
import { ActualBaseBrick } from '../Base/ActualBaseBrick';
import { BaseRenderer } from '../Base/BaseRenderer';
import { Store } from '../Store/Store';
import { WhichEnd } from '../Track/WhichEnd';
import { End } from '../Track/End';
import { Wagon } from './Wagon';
import { Ray } from '../Geometry/Ray';
import { TYPES } from '../TYPES';
import { WagonRenderer } from './WagonRenderer';
import { TrackBase } from '../TrackBase/TrackBase';
import { LineSegment } from '../Geometry/LineSegment';

const WAGON_GAP: number = 1;

@injectable()
export class ActualWagon extends ActualBaseBrick implements Wagon {
  private removed: boolean = false;
  protected snake: TrackBase[];

  @inject(TYPES.WagonRenderer) private renderer: WagonRenderer;

  getLength(): number {
    return 14;
  }

  remove(): boolean {
    this.removed = true;
    this.snake.map(s => s.checkout(this));
    this.update();
    return true;
  }
  isRemoved(): boolean {
    return this.removed;
  }
  init(): Wagon {
    super.initStore();

    this.ends = {
      [WhichEnd.A]: new WagonEnd(WhichEnd.A, this),
      [WhichEnd.B]: new WagonEnd(WhichEnd.B, this)
    };

    return this;
  }

  getA(): WagonEnd {
    return this.ends.A;
  }

  getB(): WagonEnd {
    return this.ends.B;
  }

  private ends: Record<WhichEnd, WagonEnd>;

  getRenderer(): BaseRenderer {
    return this.renderer;
  }
  persist(): Object {
    throw new Error('Method not implemented.');
  }
  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
  update() {
    this.renderer.update();
  }

  putOnTrack(
    track: TrackBase,
    position: number = 0,
    direction: number = 1
  ): void {
    //if (!track.isEmpty()) return false;

    this.ends.A.positionOnTrack = new PositionOnTrack(
      track,
      null,
      position,
      direction
    );

    this.ends.B.positionOnTrack = new PositionOnTrack(
      track,
      null,
      position,
      direction
    );

    this.ends.B.positionOnTrack.copyFrom(this.ends.A.positionOnTrack);
    this.ends.B.positionOnTrack.hop(this.getLength());

    // SNAKE
    const bTrack = this.ends.B.positionOnTrack.getTrack();
    if (track === bTrack) {
      track.checkin(this);
      this.snake = [track];
    } else {
      track.checkin(this);
      bTrack.checkin(this);
      this.snake = [track, bTrack];
    }

    this.renderer.init(this);
    this.update();
  }

  getRay(): Ray {
    const ls = LineSegment.fromTwoPoints(
      this.ends.A.positionOnTrack.getRay().coord,
      this.ends.B.positionOnTrack.getRay().coord
    );
    return ls.getPointAtHalfway();
  }

  forward(distance: number): void {
    if (this.ends.B.hasConnectedEndOf()) return;

    this.ends.B.positionOnTrack.hop(distance);
    this.ends.A.positionOnTrack.copyFrom(this.ends.B.positionOnTrack);
    const jSnake = this.ends.A.positionOnTrack.hop(-this.getLength()).reverse();

    // SNAKE
    // jSnake and snake is also A -> B
    // console.log('s', this.snake.map(x => x.getId()));
    // console.log('j', jSnake.map(x => x.getId()));

    let i = 0;
    let j = 0;
    while (jSnake[j] !== this.snake[i] && i < this.snake.length) {
      this.snake[i].checkout(this);
      i++;
    }

    while (
      jSnake[j] === this.snake[i] &&
      i < this.snake.length &&
      j < jSnake.length
    ) {
      i++;
      j++;
    }

    while (j < jSnake.length) {
      jSnake[j].checkin(this);
      j++;
    }

    this.snake = jSnake;
    // SNAKE END

    // if (!this.snake.includes(newSnake[0])) {
    //   this.snake.push(newSnake[0]);
    //   newSnake[0].checkin(null);
    // }

    this.update();

    if (this.ends.A.hasConnectedEndOf()) {
      const next = this.ends.A.getConnectedEndOf();
      next.pullForward(this.ends.A.positionOnTrack);
    }
  }

  pullForward(pot: PositionOnTrack) {
    this.getB().positionOnTrack.copyFrom(pot);
    this.getB().positionOnTrack.hop(-WAGON_GAP);
    this.getA().positionOnTrack.copyFrom(this.getB().positionOnTrack);
    const jSnake = this.getA()
      .positionOnTrack.hop(-this.getLength())
      .reverse();

    // SNAKE
    // jSnake and snake is also A -> B
    // console.log('s', this.snake.map(x => x.getId()));
    // console.log('j', jSnake.map(x => x.getId()));

    let i = 0;
    let j = 0;
    while (jSnake[j] !== this.snake[i] && i < this.snake.length) {
      this.snake[i].checkout(this);
      i++;
    }

    while (
      jSnake[j] === this.snake[i] &&
      i < this.snake.length &&
      j < jSnake.length
    ) {
      i++;
      j++;
    }

    while (j < jSnake.length) {
      jSnake[j].checkin(this);
      j++;
    }

    this.snake = jSnake;
    // SNAKE END

    this.update();

    if (this.ends.A.hasConnectedEndOf()) {
      const next = this.ends.A.getConnectedEndOf();
      next.pullForward(this.ends.A.positionOnTrack);
    }
  }

  backward(distance: number): void {
    if (this.ends.A.hasConnectedEndOf()) return;

    this.ends.A.positionOnTrack.hop(-distance);
    this.ends.B.positionOnTrack.copyFrom(this.ends.A.positionOnTrack);
    const jSnake = this.ends.B.positionOnTrack.hop(this.getLength());

    // SNAKE
    // jSnake and snake is also A -> B
    // console.log('s', this.snake.map(x => x.getId()));
    // console.log('j', jSnake.map(x => x.getId()));

    let i = this.snake.length - 1;
    let j = jSnake.length - 1;
    while (jSnake[j] !== this.snake[i] && i > -1) {
      this.snake[i].checkout(this);
      i--;
    }

    while (jSnake[j] === this.snake[i] && i > -1 && j > -1) {
      i--;
      j--;
    }

    while (j > -1) {
      jSnake[j].checkin(this);
      j--;
    }

    this.snake = jSnake;
    // SNAKE END

    this.update();

    if (this.ends.B.hasConnectedEndOf()) {
      const next = this.ends.B.getConnectedEndOf();
      next.pullBackward(this.ends.B.positionOnTrack);
    }
  }

  pullBackward(pot: PositionOnTrack) {
    this.getA().positionOnTrack.copyFrom(pot);
    this.getA().positionOnTrack.hop(WAGON_GAP);
    this.getB().positionOnTrack.copyFrom(this.getA().positionOnTrack);
    const jSnake = this.getB().positionOnTrack.hop(this.getLength());

    // SNAKE
    // jSnake and snake is also A -> B
    // console.log('s', this.snake.map(x => x.getId()));
    // console.log('j', jSnake.map(x => x.getId()));

    let i = this.snake.length - 1;
    let j = jSnake.length - 1;
    while (jSnake[j] !== this.snake[i] && i > -1) {
      this.snake[i].checkout(this);
      i--;
    }

    while (jSnake[j] === this.snake[i] && i > -1 && j > -1) {
      i--;
      j--;
    }

    while (j > -1) {
      jSnake[j].checkin(this);
      j--;
    }

    this.snake = jSnake;
    // SNAKE END

    this.update();

    if (this.ends.B.hasConnectedEndOf()) {
      const next = this.ends.B.getConnectedEndOf();
      next.pullBackward(this.ends.B.positionOnTrack);
    }
  }
}

export class WagonEnd extends End<Wagon> {
  public positionOnTrack: PositionOnTrack;

  getPositionOnTrack() {
    return this.positionOnTrack;
  }
}
