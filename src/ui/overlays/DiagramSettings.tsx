import React, { useCallback } from 'react';
import { OverlayController } from './OverlayController';
import { pixiMapSettingsStyle, settingsButtonStyle } from './styles';

interface Props {
};

const overlayController = OverlayController.getInstance();

export const DiagramSettings: React.FC<Props> = props => {

    const handleMoveAll = useCallback((time: number) => () => {
        overlayController.moveAll(time);
    }, []);

    return <div className={pixiMapSettingsStyle} style={{ display: 'flex' }} >
        <button className={settingsButtonStyle} onClick={handleMoveAll(-60)}>All--</button>
        <button className={settingsButtonStyle} onClick={handleMoveAll(-10)}>All-</button>
        <button className={settingsButtonStyle} onClick={handleMoveAll(+10)}>All+</button>
        <button className={settingsButtonStyle} onClick={handleMoveAll(+60)}>All++</button>
    </div>;
}
