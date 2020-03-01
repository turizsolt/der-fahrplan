import { Coordinate } from '../Coordinate';
import { BezierLinear } from './BezierLinear';
import { BezierQuadratic } from './BezierQuadratic';
import { Bezier } from './Bezier';

export abstract class BezierCreater {
  static Create(coordinates: Coordinate[]): Bezier {
    const filteredCoordinates = coordinates.filter(x => x !== undefined);
    switch (filteredCoordinates.length) {
      case 2:
        return new BezierLinear(filteredCoordinates);
      case 3:
        return new BezierQuadratic(filteredCoordinates);
    }

    throw new Error('Not right ammount of coordinates to create a Bezier');
  }
}
