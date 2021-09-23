import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { Ray } from '../../src/structs/Geometry/Ray';
import { Right } from '../../src/structs/Geometry/Directions';
import { LineSegmentChain } from '../../src/structs/Geometry/LineSegmentChain';
chai.use(chaiAlmost(0.00001));

describe('Line segment chain', () => {
    it('to point, first point', () => {
        const chain = LineSegmentChain.fromRays([
            Ray.from(0, 0, 0, Right),
            Ray.from(100, 0, 0, Right),
        ]);

        const point = new Coordinate(0, 0, 0);

        const newChain = chain.getChainToPoint(point);
        const expectedChain = LineSegmentChain.fromRays([Ray.from(0, 0, 0, Right), Ray.from(0, 0, 0, Right)]);

        expect(newChain.persist()).deep.almost(expectedChain.persist());
    });
});
