import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TYPES } from '../../di/TYPES';
import { createStorable, getAllOfStorable } from '../../structs/Actuals/Store/StoreForVue';
import { Color } from '../../structs/Color';
import { Route } from '../../structs/Scheduling/Route';
import { AppDispatch, RootState, selectRoute, StorableRoute, updateRouteList } from './store';
import { routeListStyle } from './styles';

interface Props { };

export const RouteList: React.FC<Props> = props => {

    const { routeList, selectedRoute, overlayMode } = useSelector((state: RootState) => state.overlay);

    const whenMapOrDiagram = (overlayMode === 'map' || overlayMode === 'diagram') ? 'visible' : 'hidden';

    const dispatch = useDispatch<AppDispatch>();

    const handleLoad = useCallback(() => {
        const rl = getAllOfStorable(TYPES.Route).map(r => r.persistDeep()) as StorableRoute[];
        dispatch(updateRouteList(rl));
    }, []);

    const handleSelect = useCallback((sel: string) => () => {
        dispatch(selectRoute(sel));
    }, []);

    const handleCreate = useCallback(() => {
        const route = createStorable<Route>(TYPES.Route).init();
        route.setName("ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26)) + (Math.floor(Math.random() * 90 + 10)).toString());
        route.setColor(Color.CreateRandom().getHexaString());

        const rl = getAllOfStorable(TYPES.Route).map(r => r.persistDeep()) as StorableRoute[];
        dispatch(updateRouteList(rl));
        dispatch(selectRoute(route.getId()));
    }, []);

    return <div className={routeListStyle} style={{ visibility: whenMapOrDiagram }} >
        Route list
        <button onClick={handleLoad}>Load</button>
        <button onClick={handleCreate}>Create</button>
        <div>Selected: {selectedRoute}</div>
        <div onClick={handleSelect(null)}>Select nothing</div>
        {routeList.map(route => <div key={route.id} onClick={handleSelect(route.id)}>
            {route.name}
            [{route.id}]
            {route.variants?.[0]}
        </div>)}
    </div>
}
