import React from 'react';
import { useSelector } from 'react-redux';
import { DiagramTime } from './DiagramTime';
import { MapSettings } from './MapSettings';
import { RouteList } from './RouteList';
import { RootState } from './store';
import { connectorStyle, overlayStyle, pixiDiagramContainerStyle, pixiMapContainerStyle, pixiMapSettingsStyle, rightColumnStyle, routeListStyle } from './styles';

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
            <div className={pixiDiagramContainerStyle} id="pixi-diagram-container"></div>
            <DiagramTime />
        </div>
        <div className={connectorStyle} style={{ visibility: whenConnector }}>Connector</div>
    </div>;
}
