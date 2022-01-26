import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { OverlayController } from './OverlayController';
import { RootState } from './store';
import { routeListStyle } from './styles';

interface Props { };

const overlayController = OverlayController.getInstance();

export const RouteList: React.FC<Props> = props => {

    const { routeList, selectedRoute, overlayMode } = useSelector((state: RootState) => state.overlay);

    const whenMapOrDiagram = (overlayMode === 'map' || overlayMode === 'diagram') ? 'visible' : 'hidden';

    const handleUpdateRouteList = useCallback(() => {
        overlayController.updateRouteList();
    }, []);

    const handleSelect = useCallback((sel: string) => () => {
        overlayController.selectRoute(sel);
    }, []);

    const handleUpdateMap = useCallback(() => {
        overlayController.updateMap();
    }, []);

    const handleCreate = useCallback(() => {
        overlayController.createRoute();
    }, []);

    return <div className={routeListStyle} style={{ visibility: whenMapOrDiagram }} >
        Route list
        <button onClick={handleUpdateRouteList}>Load</button>
        <button onClick={handleCreate}>Create</button>
        <button onClick={handleUpdateMap}>UpdMap</button>
        <div>Selected: {selectedRoute}</div>
        <div onClick={handleSelect(null)}>Select nothing</div>
        {routeList.map(route => <div key={route.id} onClick={handleSelect(route.id)}>
            {route.name}
            [{route.id}]
            {route.detailedName}
        </div>)}
    </div>
}
