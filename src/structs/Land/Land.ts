import { Engine } from '../Engine/Engine';
import { Controller } from '../../controllers/Controller';

export interface Land {
  init(controller: Controller): Engine;
}
