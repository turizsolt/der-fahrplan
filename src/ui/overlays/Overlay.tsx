import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteList } from './RouteList';
import { RootState } from './store';
import { connectorStyle, overlayStyle, pixiMapContainerStyle, pixiMapSettingsStyle, rightColumnStyle, routeListStyle } from './styles';

interface Props { };

export const Overlay: React.FC<Props> = props => {

    const mode = useSelector((state: RootState) => state.overlay.overlayMode);

    const whenMap = mode === 'map' ? 'visible' : 'hidden';
    const whenDiagram = mode === 'diagram' ? 'visible' : 'hidden';
    const whenConnector = mode === 'connector' ? 'visible' : 'hidden';

    return <div className={overlayStyle}>
        <RouteList />
        <div className={rightColumnStyle} style={{ visibility: whenMap }}>
            <div className={pixiMapSettingsStyle} >Map settings</div>
            <div className={pixiMapContainerStyle} id="pixi-map-container"></div>
        </div>
        <div className={rightColumnStyle} style={{ visibility: whenDiagram }}>
            <div className={pixiMapSettingsStyle}>Diagram settings</div>
            <div className={pixiMapContainerStyle} id="pixi-diagram-container">Pixi diagram</div>
        </div>
        <div className={connectorStyle} style={{ visibility: whenConnector }}>Connector</div>
    </div>;
}
