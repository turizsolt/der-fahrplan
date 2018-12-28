import { Coordinate } from './Coordinate';

export class Vector extends Coordinate {
    
    public constructor(
        public y: number,
        public x: number,
        public degree: number,
    ) {
        super(y, x);
    };
}