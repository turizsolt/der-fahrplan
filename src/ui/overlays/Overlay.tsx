import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapSettings } from './MapSettings';
import { RouteList } from './RouteList';
import { RootState } from './store';
import { connectorStyle, overlayStyle, pixiMapContainerStyle, pixiMapSettingsStyle, rightColumnStyle, routeListStyle } from './styles';

interface Props { };

export const Overlay: React.FC<Props> = props => {

    const { overlayMode: mode, selectedRoute } = useSelector((state: RootState) => state.overlay);

    const whenMap = mode === 'map' ? 'visible' : 'hidden';
    const whenDiagram = mode === 'diagram' ? 'visible' : 'hidden';
    const whenConnector = mode === 'connector' ? 'visible' : 'hidden';

    return <div className={overlayStyle}>
        <RouteList />
        <div className={rightColumnStyle} style={{ visibility: whenMap }}>
            <MapSettings key={selectedRoute?.id} route={selectedRoute} />
            <div className={pixiMapContainerStyle} id="pixi-map-container"></div>
        </div>
        <div className={rightColumnStyle} style={{ visibility: whenDiagram }}>
            <div className={pixiMapSettingsStyle}>Diagram settings</div>
            <div className={pixiMapContainerStyle} id="pixi-diagram-container"></div>
        </div>
        <div className={connectorStyle} style={{ visibility: whenConnector }}>Connector</div>
    </div>;
}
