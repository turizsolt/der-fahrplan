import { CameraInputProps } from './InputHandlers/CameraInputProps';

export interface TickInputProps {
  canvasWidth: number;
  canvasHeight: number;
  setFollowCamOff: () => void;
  camera: CameraInputProps;
}
