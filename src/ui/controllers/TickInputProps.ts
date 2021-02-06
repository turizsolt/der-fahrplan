export interface TickInputProps {
  pointerX: number;
  pointerY: number;
  canvasWidth: number;
  canvasHeight: number;
  targetX: number;
  targetZ: number;
  fromX: number;
  fromY: number;
  fromZ: number;
  setFollowCamOff: () => void;
}
