import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { style } from 'typestyle';

interface Props { };

const overlayStyle = style({
    display: 'flex',
    width: '100%',
    height: '100%'
});

const routeListStyle = style({
    width: '250px',
    height: '100%',
    border: '1px solid blue'
});

const rightColumnStyle = style({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
});

const pixiMapSettingsStyle = style({
    width: '100%',
    height: '40px',
    border: '1px solid green'
});

const pixiMapContainerStyle = style({
    width: '100%',
    height: '100%',
    position: 'relative',
    border: '1px solid red'
});

export const Overlay: React.FC<Props> = props => {

    const mode = useSelector((state: any) => state.overlay.overlayMode);

    return <div className={overlayStyle}>
        {(mode === 'map' || mode === 'diagram') && <div className={routeListStyle}>Route list</div>}
        {(mode === 'map' || mode === 'diagram') && <div className={rightColumnStyle}>
            {mode === 'map' && <div className={pixiMapSettingsStyle}>Map settings</div>}
            {mode === 'diagram' && <div>Diagram settings</div>}
            {mode === 'map' && <div className={pixiMapContainerStyle} id="pixi-map-container"></div>}
            {mode === 'diagram' && <div id="pixi-diagram-container">Pixi diagram</div>}
        </div>}
        {mode === 'connector' && <div>Connector</div>}
    </div>;
}
