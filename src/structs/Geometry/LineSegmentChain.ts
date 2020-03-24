import { Coordinate } from './Coordinate';
import { Ray } from './Ray';
import { RayPair } from './RayPair';
import { LineSegment } from './LineSegment';
import { Circle } from './Circle';

export const DEFAULT_PRECISION: number = 9;
export const DEFAULT_SPACING: number = 2;

export class LineSegmentChain {
  private rays: Ray[];
  private length: number;

  private constructor(rays: Ray[]) {
    this.rays = rays;

    this.length = 0;
    for (let segment of this.getLineSegments()) {
      this.length += segment.getLength();
    }
  }

  static fromRays(rays: Ray[]) {
    return new LineSegmentChain(rays);
  }

  getLength() {
    return this.length;
  }

  getRays() {
    return this.rays;
  }

  getPoints() {
    return this.rays.map(r => r.coord);
  }

  getLineSegments(): LineSegment[] {
    const segments = [];
    for (let i = 1; i < this.rays.length; i++) {
      segments.push(
        LineSegment.fromTwoPoints(this.rays[i - 1].coord, this.rays[i].coord)
      );
    }
    return segments;
  }

  getRayPairs(): RayPair[] {
    const pairs = [];
    for (let i = 1; i < this.rays.length; i++) {
      pairs.push(new RayPair(this.rays[i - 1], this.rays[i]));
    }
    return pairs;
  }

  getRayPairsFromPoint(p: Coordinate): RayPair[] {
    const pairs = [];
    let put = false;
    for (let i = 1; i < this.rays.length; i++) {
      const seg = LineSegment.fromTwoPoints(
        this.rays[i - 1].coord,
        this.rays[i].coord
      );
      if (seg.contains(p)) {
        put = true;
        pairs.push(new RayPair(new Ray(p, seg.getDir()), this.rays[i]));
      } else {
        if (put) pairs.push(new RayPair(this.rays[i - 1], this.rays[i]));
      }
    }
    return pairs;
  }

  getRayPairsToPoint(p: Coordinate): RayPair[] {
    const pairs = [];
    let put = true;
    for (let i = 1; i < this.rays.length; i++) {
      const seg = LineSegment.fromTwoPoints(
        this.rays[i - 1].coord,
        this.rays[i].coord
      );
      if (seg.contains(p)) {
        put = false;
        pairs.push(new RayPair(this.rays[i - 1], new Ray(p, seg.getDir())));
      } else {
        if (put) pairs.push(new RayPair(this.rays[i - 1], this.rays[i]));
      }
    }
    return pairs;
  }

  getChainFromPoint(p: Coordinate): LineSegmentChain {
    const rays = [];
    let put = false;
    for (let i = 1; i < this.rays.length; i++) {
      const seg = LineSegment.fromTwoPoints(
        this.rays[i - 1].coord,
        this.rays[i].coord
      );
      if (seg.contains(p)) {
        put = true;
        rays.push(new Ray(p, seg.getDir()));
      }
      if (put) rays.push(this.rays[i]);
    }
    return LineSegmentChain.fromRays(rays);
  }

  getChainToPoint(p: Coordinate): LineSegmentChain {
    const rays = [];
    let put = true;
    for (let i = 1; i < this.rays.length; i++) {
      const seg = LineSegment.fromTwoPoints(
        this.rays[i - 1].coord,
        this.rays[i].coord
      );
      if (put) rays.push(this.rays[i - 1]);
      if (seg.contains(p)) {
        put = false;
        if (!this.rays[i - 1].coord.equalsTo(p))
          rays.push(new Ray(p, seg.getDir()));
      }
    }
    return LineSegmentChain.fromRays(rays);
  }

  copyMove(dir: number, dist: number): LineSegmentChain {
    return LineSegmentChain.fromRays(this.rays.map(r => r.fromHere(dir, dist)));
  }

  getRayByDistance(distance: number): Ray {
    const segments = this.getLineSegments();
    let segment = 0;

    let sdist = segments[segment].getLength();
    let pos = distance;

    while (pos > sdist && segment < segments.length - 1) {
      pos -= sdist;
      segment++;
      sdist = segments[segment].getLength();
    }

    if (segment < segments.length)
      return segments[segment].getPointAtDistance(pos); // todo ez itt nem klafa
    return null;
  }

  getEvenlySpacedRays(
    spacing: number = DEFAULT_SPACING,
    oddly: boolean = false
  ): Ray[] {
    const points = [];
    const segments = this.getRayPairs();
    const length = this.getLength();
    let segment = 0;
    let gone = 0;
    let pos = 0;

    const put = () => {
      points.push(segments[segment].getPointAtDistance(pos));
    };

    put();
    let sdist;
    while (gone < length) {
      sdist = segments[segment].getLength();
      pos = pos + spacing;
      gone = gone + spacing;

      while (pos > sdist && segment < segments.length - 1) {
        pos -= sdist;
        segment++;
        sdist = segments[segment].getLength();
      }

      if (gone < length) put();
    }

    // todo ugly conditions
    return points.filter(
      (v, i) => i % 2 === (oddly ? 0 : 1) && (!oddly || i !== 0)
    );
  }

  getRadiallySpacedRays(
    maxRad: number,
    spacing: number = DEFAULT_SPACING
  ): Ray[] {
    const points = [];
    const segments = this.getRayPairs();
    let rad = 0;

    points.push(this.rays[0]);

    while (rad < maxRad) {
      rad = rad + spacing;
      const circle = new Circle(this.rays[0].coord, rad);
      for (let seg of segments) {
        const is = circle
          .getIntersectionsWithLine(seg.toLine())
          .filter(x => seg.contains(x));
        is.map(x => points.push(new Ray(x, seg.getDir())));
      }
    }

    return points.filter((v, i) => i % 2 === 1);
  }

  project(p: Coordinate): Ray {
    for (let segment of this.getLineSegments()) {
      const ray = segment.project(p);
      if (ray) return ray;
    }
    return null;
  }

  getIntersectionsWithCirlce(circle: Circle) {
    const points = [];
    for (let segment of this.getLineSegments()) {
      const ps = segment.getIntersectionsWithCirlce(circle);
      points.push(...ps);
    }
    return points;
  }

  isIntersectsWithChain(other: LineSegmentChain): boolean {
    for (let segment of this.getLineSegments()) {
      for (let otherSegment of other.getLineSegments()) {
        if (segment.isIntersectsWith(otherSegment)) return true;
      }
    }
    return false;
  }
}
