import { BaseRenderer } from '../Renderers/BaseRenderer';
import { BaseStorable } from './BaseStorable';

export interface BaseBrick extends BaseStorable {
  getRenderer(): BaseRenderer;
}
