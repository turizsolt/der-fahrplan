import * as BABYLON from 'babylonjs';
import { injectable, inject } from 'inversify';
import { BaseBabylonRenderer } from './BaseBabylonRenderer';
import { SignalRenderer } from '../../structs/Renderers/SignalRenderer';

@injectable()
export class SignalBabylonRenderer extends BaseBabylonRenderer
  implements SignalRenderer {
  init(signal: any): void {}
}
