import { CameraInputProps } from './InputHandlers/Camera/CameraInputProps';

export interface TickInputProps {
  canvasWidth: number;
  canvasHeight: number;
  setFollowCamOff: () => void;
  camera?: CameraInputProps;
  camera2d?: any;
}
