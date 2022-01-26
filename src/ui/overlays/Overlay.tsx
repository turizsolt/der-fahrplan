import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { style } from 'typestyle';
import { RootState } from './store';

interface Props { };

const overlayStyle = style({
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '100%'
});

const routeListStyle = style({
    border: '1px solid blue',
    position: 'absolute',
    width: '240px',
    height: 'calc(100% - 20px)',
    left: '0px',
    top: '0px'
});

const rightColumnStyle = style({
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    width: 'calc(100% - 270px)',
    height: 'calc(100% - 20px)',
    left: '250px',
    top: '0px'
});

const pixiMapSettingsStyle = style({
    width: '100%',
    height: '40px',
    border: '1px solid green',
    marginBottom: '10px'
});

const pixiMapContainerStyle = style({
    width: '100%',
    height: 'calc(100% - 10px)',
    position: 'relative',
    border: '1px solid red',
});

const connectorStyle = style({
    border: '1px solid red',
    position: 'absolute',
    width: 'calc(100% - 20px)',
    height: 'calc(100% - 20px)',
    left: '0px',
    top: '0px'
});

export const Overlay: React.FC<Props> = props => {

    const mode = useSelector((state: RootState) => state.overlay.overlayMode);

    const whenMap = mode === 'map' ? 'visible' : 'hidden';
    const whenDiagram = mode === 'diagram' ? 'visible' : 'hidden';
    const whenMapOrDiagram = (mode === 'map' || mode === 'diagram') ? 'visible' : 'hidden';
    const whenConnector = mode === 'connector' ? 'visible' : 'hidden';

    return <div className={overlayStyle}>
        <div className={routeListStyle} style={{ visibility: whenMapOrDiagram }} >Route list</div>
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
