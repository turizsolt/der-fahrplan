import { InputHandler } from '../InputHandler';
import { click } from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { InputProps } from '../../InputProps';
import { CommandLog } from '../../../../structs/Actuals/Store/Command/CommandLog';
import { AssignStationInputHandlerPlugin } from './AssignStationInputHandlerPlugin';
import { AssignStationInputHandlerPixi } from './AssignStationInputHandlerPixi';
import { AssignStationInputHandlerBabylon } from './AssignStationInputHandlerBabylon';
import { MeshInfo } from '../../MeshInfo';
import { BaseBrick } from '../../../../structs/Interfaces/BaseBrick';
import { TYPES } from '../../../../di/TYPES';
import { MouseLeft, MouseRight } from '../Interfaces/InputType';
import { AbstractPlatform } from '../../../../modules/Station/AbstractPlatform';
import { Station } from '../../../../modules/Station/Station';
import { Circle } from '../../../../structs/Geometry/Circle';
import { Coordinate } from '../../../../structs/Geometry/Coordinate';

// @injectable()
export class AssignStationInputHandler extends InputHandler {
    private commandLog: CommandLog;
    private abstractPlatforms: AbstractPlatform[] = [];

    // @inject(TYPES.TrackInputHandler)
    private plugin: AssignStationInputHandlerPlugin;

    constructor(private store: Store) {
        super();

        this.canPushAPlatform = this.canPushAPlatform.bind(this);

        // todo inject
        this.plugin =
            globalThis.startParam === '2d'
                ? new AssignStationInputHandlerPixi()
                : new AssignStationInputHandlerBabylon();
        this.plugin.init();
        this.commandLog = store.getCommandLog();

        this.reg(click(MouseLeft), (legacyEvent: PointerEvent) => {
            const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
            if (!this.canPushAPlatform(legacyProps)) return false;
        });

        this.reg(click(MouseRight), (legacyEvent: PointerEvent) => {
            const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
            if (!this.canPushAPlatform(legacyProps)) return false;

            if (!this.abstractPlatforms.some(p => p.getStation())) {
                // no platform connected to station, connect all          // todo
                const station = store.create<Station>(TYPES.Station).init(new Circle(new Coordinate(0, 0, 0), 0));
                this.abstractPlatforms.map(p => p.setStation(station));
            } else if (this.abstractPlatforms?.[0].getStation()) {
                if (this.abstractPlatforms.every(p => p.getStation())) {
                    // remove these from station
                    this.abstractPlatforms.map(p => p.setStation(null));
                } else {
                    // add the non-station ones to the 0th
                    const station = this.abstractPlatforms?.[0].getStation();
                    this.abstractPlatforms.filter(p => !p.getStation()).map(p => p.setStation(station));
                }
            }

            this.abstractPlatforms = [];
        });
    }

    private canPushAPlatform(legacyProps: InputProps): boolean {
        const meshInfo = this.getMeshInfo(legacyProps?.mesh?.id);
        if (!meshInfo || !meshInfo.storedBrick) return false;
        if (meshInfo.type !== TYPES.Platform && meshInfo.type !== TYPES.WaitingHall) return false;

        const abstractPlatform = this.store.get(meshInfo.id) as unknown as AbstractPlatform;

        this.abstractPlatforms.push(abstractPlatform);
        return true;
    }

    // todo duplicate from SelectInputHandler
    private getMeshInfo(meshId: string): MeshInfo {
        if (!meshId) return null;

        if (meshId.includes('.')) {
            meshId = meshId.slice(0, meshId.indexOf('.'));
        }

        if (meshId.startsWith('clickable-')) {
            const [_, type, id, command] = meshId.split('-');
            const storedObj = this.store.get(id);
            const storedBrick = storedObj as BaseBrick;
            return {
                typeString: type, id, command, storedBrick, type: storedBrick?.getType()
            };
        }

        return null;
    }
}
