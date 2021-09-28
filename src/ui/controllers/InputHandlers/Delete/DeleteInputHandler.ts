import { InputHandler } from '../InputHandler';
import { click } from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { InputProps } from '../../InputProps';
import { CommandLog } from '../../../../structs/Actuals/Store/Command/CommandLog';
import { MeshInfo } from '../../MeshInfo';
import { BaseBrick } from '../../../../structs/Interfaces/BaseBrick';
import { TYPES } from '../../../../di/TYPES';
import { MouseLeft } from '../Interfaces/InputType';
import { BaseStorable } from '../../../../structs/Interfaces/BaseStorable';

// @injectable()
export class DeleteInputHandler extends InputHandler {
    private commandLog: CommandLog;

    constructor(private store: Store) {
        super();

        this.acceptedToDelete = this.acceptedToDelete.bind(this);

        // todo inject
        this.commandLog = store.getCommandLog();

        this.reg(click(MouseLeft), (legacyEvent: PointerEvent) => {
            const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
            const toDelete = this.acceptedToDelete(legacyProps);
            if (!toDelete) return false;

            toDelete.remove();
        });
    }

    private acceptedToDelete(legacyProps: InputProps): BaseStorable {
        const meshInfo = this.getMeshInfo(legacyProps?.mesh?.id);
        if (!meshInfo || !meshInfo.storedBrick) return null;
        if (![TYPES.Block, TYPES.BlockJoint, TYPES.Section, TYPES.Signal, TYPES.CapacityCap, TYPES.Sensor, TYPES.PathBlock].includes(meshInfo.type)) return null;

        return this.store.get(meshInfo.id);
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
