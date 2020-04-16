import { BaseBrick } from '../Interfaces/BaseBrick';
import { injectable } from 'inversify';
import { BaseRenderer } from '../Renderers/BaseRenderer';
import { ActualBaseStorable } from './ActualStorable';

@injectable()
export abstract class ActualBaseBrick extends ActualBaseStorable
  implements BaseBrick {
  abstract getRenderer(): BaseRenderer;
}
