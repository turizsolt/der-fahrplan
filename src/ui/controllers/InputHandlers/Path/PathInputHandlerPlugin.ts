export interface PathInputHandlerPlugin {
  init(): void;
  click(): void;
  cancel(): void;
}
