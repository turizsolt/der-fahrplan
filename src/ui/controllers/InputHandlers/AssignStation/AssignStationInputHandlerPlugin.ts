export interface AssignStationInputHandlerPlugin {
    init(): void;
    click(): void;
    cancel(): void;
}
