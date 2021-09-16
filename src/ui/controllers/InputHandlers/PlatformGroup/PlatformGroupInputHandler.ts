import { InputHandler } from '../InputHandler';
import { click } from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { InputProps } from '../../InputProps';
import { CommandLog } from '../../../../structs/Actuals/Store/Command/CommandLog';
import { MeshInfo } from '../../MeshInfo';
import { BaseBrick } from '../../../../structs/Interfaces/BaseBrick';
import { TYPES } from '../../../../di/TYPES';
import { MouseLeft, MouseRight } from '../Interfaces/InputType';
import { AbstractPlatform } from '../../../../modules/Station/AbstractPlatform';
import { PlatformGroup } from '../../../../modules/Station/PlatformGroup';
import { Platform } from '../../../../modules/Station/Platform';

// @injectable()
export class PlatformGroupInputHandler extends InputHandler {
    private commandLog: CommandLog;
    private abstractPlatforms: AbstractPlatform[] = [];

    constructor(private store: Store) {
        super();

        this.canPushAPlatform = this.canPushAPlatform.bind(this);

        // todo inject
        this.commandLog = store.getCommandLog();

        this.reg(click(MouseLeft), (legacyEvent: PointerEvent) => {
            const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
            if (!this.canPushAPlatform(legacyProps)) return false;
        });

        this.reg(click(MouseRight), (legacyEvent: PointerEvent) => {
            const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
            if (!this.canPushAPlatform(legacyProps)) return false;

            const platformGroup = store.create<PlatformGroup>(TYPES.PlatformGroup).init(this.abstractPlatforms as Platform[]);

            this.abstractPlatforms = [];
        });
    }

    private canPushAPlatform(legacyProps: InputProps): boolean {
        const meshInfo = this.getMeshInfo(legacyProps?.mesh?.id);
        if (!meshInfo || !meshInfo.storedBrick) return false;
        if (meshInfo.type !== TYPES.Platform) return false;

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
