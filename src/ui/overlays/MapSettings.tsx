import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getStorable } from '../../structs/Actuals/Store/StoreForVue';
import { Route } from '../../structs/Scheduling/Route';
import { OverlayController } from './OverlayController';
import { RootState, StorableRoute } from './store';
import { pixiMapSettingsStyle } from './styles';

interface Props {
    route: StorableRoute;
};

const overlayController = OverlayController.getInstance();

export const MapSettings: React.FC<Props> = props => {
    const { route } = props;

    const { createExpress } = useSelector((state: RootState) => state.overlay);

    const handleNameChange = useCallback((event: any) => {
        const rt = getStorable(route.id) as Route;
        rt.setName(event.target.value);
        overlayController.updateRouteList();
    }, [route]);

    const handleColorChange = useCallback((event: any) => {
        const rt = getStorable(route.id) as Route;
        rt.setColor(event.target.value);
        overlayController.updateRouteList();
        overlayController.updateMap();
    }, [route]);

    const handleStopPropagation = useCallback((event: any) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }, []);

    const handleSelectExpress = useCallback((express: boolean) => () => {
        overlayController.setSelectExpress(express);
    }, []);

    return <div className={pixiMapSettingsStyle} style={{ display: 'flex', justifyContent: 'space-between' }} >
        <div>
            {route && <>
                Name: <input type="text" defaultValue={route.name} onChange={handleNameChange} onKeyDown={handleStopPropagation} onKeyUp={handleStopPropagation} style={{ marginRight: '10px', width: '4em', textAlign: 'center' }} />
                Color: <input type="color" defaultValue={route.color} onChange={handleColorChange} style={{ height: '21px' }} />
            </>}
        </div>
        <div>
            <input type="radio" checked={!createExpress} onChange={handleSelectExpress(false)} /> Local
            <input type="radio" checked={createExpress} onChange={handleSelectExpress(true)} /> Express
        </div>
    </div>;
}
