interface WagonControl {
  getSpeed(): number;
  accelerate(): void;
  break(): void;
  shountForward(): void;
  shountBackward(): void;
  tick(): void;
  emergencyBreak(): void;
  releaseEmergencyBreak(): void;
}
