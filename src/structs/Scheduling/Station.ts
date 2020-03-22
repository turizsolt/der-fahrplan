import { BaseBrick } from '../Interfaces/BaseBrick';

export interface Station extends BaseBrick {
  init(): Station;
  getName(): string;
  setName(name: string);
}
