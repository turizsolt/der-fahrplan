import React, { useCallback } from 'react';
import { OverlayController } from './OverlayController';
import { arrivalButtonStyle, departureButtonStyle, pixiMapSettingsStyle, settingsButtonStyle } from './styles';

interface Props {
};

const overlayController = OverlayController.getInstance();

export const DiagramSettings: React.FC<Props> = props => {

    const handleMoveAll = useCallback((time: number) => () => {
        overlayController.moveAll(time);
    }, []);

    const handleMoveArrival = useCallback((time: number) => () => {
        overlayController.moveArrival(time);
    }, []);

    const handleMoveDeparture = useCallback((time: number) => () => {
        overlayController.moveDeparture(time);
    }, []);

    return <div className={pixiMapSettingsStyle} style={{ display: 'flex' }} >
        <button className={settingsButtonStyle} onClick={handleMoveAll(-60)}>All--</button>
        <button className={settingsButtonStyle} onClick={handleMoveAll(-10)}>All-</button>
        <button className={settingsButtonStyle} onClick={handleMoveAll(+10)}>All+</button>
        <button className={settingsButtonStyle} onClick={handleMoveAll(+60)}>All++</button>

        <button className={settingsButtonStyle + ' ' + arrivalButtonStyle} onClick={handleMoveArrival(-60)}>Arr--</button>
        <button className={settingsButtonStyle + ' ' + arrivalButtonStyle} onClick={handleMoveArrival(-10)}>Arr-</button>
        <button className={settingsButtonStyle + ' ' + arrivalButtonStyle} onClick={handleMoveArrival(+10)}>Arr+</button>
        <button className={settingsButtonStyle + ' ' + arrivalButtonStyle} onClick={handleMoveArrival(+60)}>Arr++</button>

        <button className={settingsButtonStyle + ' ' + departureButtonStyle} onClick={handleMoveDeparture(-60)}>Dep--</button>
        <button className={settingsButtonStyle + ' ' + departureButtonStyle} onClick={handleMoveDeparture(-10)}>Dep-</button>
        <button className={settingsButtonStyle + ' ' + departureButtonStyle} onClick={handleMoveDeparture(+10)}>Dep+</button>
        <button className={settingsButtonStyle + ' ' + departureButtonStyle} onClick={handleMoveDeparture(+60)}>Dep++</button>
    </div>;
}
