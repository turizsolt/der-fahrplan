import { BaseRenderer } from './BaseRenderer';

export interface BaseBrick {
  getId(): string;
  getRenderer(): BaseRenderer;
}
