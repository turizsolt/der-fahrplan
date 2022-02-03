import React from 'react';
import { useSelector } from 'react-redux';
import { Connector } from './Connector';
import { DiagramAddTrips } from './DiagramAddTrips';
import { DiagramSettings } from './DiagramSettings';
import { DiagramTime } from './DiagramTime';
import { MapSettings } from './MapSettings';
import { RouteList } from './RouteList';
import { RootState } from './store';
import { overlayStyle, pixiDiagramContainerStyle, pixiMapContainerStyle, pixiMapSettingsStyle, rightColumnDiagramStyle, rightMapColumnStyle, rightRightColumnDiagramStyle, routeListStyle } from './styles';

interface Props { };

export const Overlay: React.FC<Props> = props => {

    const { overlayMode: mode, selectedRoute, keyVersion } = useSelector((state: RootState) => state.overlay);

    const whenMap = mode === 'map' ? 'visible' : 'hidden';
    const whenDiagram = mode === 'diagram' ? 'visible' : 'hidden';

    return <div className={overlayStyle}>
        <RouteList />
        <div className={rightMapColumnStyle} style={{ visibility: whenMap }}>
            <MapSettings key={selectedRoute?.id} route={selectedRoute} />
            <div className={pixiMapContainerStyle} id="pixi-map-container"></div>
        </div>
        <div className={rightColumnDiagramStyle} style={{ visibility: whenDiagram }}>
            <DiagramSettings />
            <div className={pixiDiagramContainerStyle} id="pixi-diagram-container"></div>
            <DiagramTime />
        </div>
        <div className={rightRightColumnDiagramStyle} style={{ visibility: whenDiagram }}>
            <DiagramAddTrips key={selectedRoute?.id + '-' + keyVersion} route={selectedRoute} />
        </div>
        <Connector />
    </div>;
}
