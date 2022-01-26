import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOverlayMode } from './store';

interface Props { };

export const Overlay: React.FC<Props> = props => {

    const greeting = 'Hello Function Component!';

    const mode = useSelector((state: any) => state.overlay.overlayMode);
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
        dispatch(setOverlayMode('map'));
    }, []);

    return <h1>
        {greeting}
        {mode}
        <button onClick={handleClick}>Plus</button>
    </h1>;
}
