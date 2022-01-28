import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { OverlayController } from './OverlayController';
import { Route } from './Route';
import { RootState } from './store';
import { routeListStyle } from './styles';
import { StorableRoute } from './store';

interface Props { };

const overlayController = OverlayController.getInstance();

export const RouteList: React.FC<Props> = props => {

    const { routeList, selectedRoute, overlayMode } = useSelector((state: RootState) => state.overlay);

    const whenMapOrDiagram = (overlayMode === 'map' || overlayMode === 'diagram') ? 'visible' : 'hidden';

    const handleUpdateRouteList = useCallback(() => {
        overlayController.updateRouteList();
        overlayController.updateMap();
    }, []);

    const handleSelect = useCallback((sel: StorableRoute) => () => {
        overlayController.selectRoute(sel.id === selectedRoute?.id ? null : sel);
        overlayController.updateMap();
    }, [selectedRoute]);

    const handleCreate = useCallback(() => {
        overlayController.createRoute();
        overlayController.updateMap();
    }, []);

    const handleCreateExampleTrip = useCallback(() => {
        if (selectedRoute) {
            overlayController.createExampleTrips(selectedRoute?.id);
        }
    }, [selectedRoute]);

    return <div className={routeListStyle} style={{ visibility: whenMapOrDiagram }} >
        Route list
        <button onClick={handleUpdateRouteList}>Update</button>
        <button onClick={handleCreate}>Create</button>
        <button onClick={handleCreateExampleTrip}>ExTrip</button>
        <hr />
        {routeList.map(route => <Route
            key={route.id}
            routeName={route.name}
            routeColor={route.color}
            startStationName={route.fistStationName}
            endStationName={route.lastStationName}
            selected={route.id === selectedRoute?.id}
            onSelect={handleSelect(route)}
        />)}
    </div>
}
