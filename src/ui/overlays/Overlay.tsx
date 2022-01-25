import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increment } from './store';

interface Props { };

export const Overlay: React.FC<Props> = props => {

    const greeting = 'Hello Function Component!';

    const value = useSelector((state: any) => state.counter.value);
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
        dispatch(increment());
    }, []);

    return <h1>
        {greeting}
        {value}
        <button onClick={handleClick}>Plus</button>
    </h1>;
}
