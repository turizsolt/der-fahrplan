import { Engine } from '../Engine/Engine';
import { OldController } from '../../controllers/OldController';

export interface Land {
  init(controller: OldController): Engine;
}
