import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { OverlayController } from './OverlayController';
import { RootState } from './store';
import { invertStyle, pixiDiagramTimeStyle, timeDotStyle } from './styles';

interface Props {
};

const overlayController = OverlayController.getInstance();

export const DiagramTime: React.FC<Props> = props => {
    const { startTime, endTime } = useSelector((state: RootState) => state.overlay);

    const times: number[] = [];
    for (let i = 4 * 3600; i <= 24 * 3600; i += 3600 / 2) {
        times.push(i);
    }

    const handleStartTimeChange = useCallback((t: number) => () => {
        overlayController.setStartTime(t);
    }, []);

    const handleEndTimeChange = useCallback((t: number) => () => {
        overlayController.setEndTime(t);
    }, []);

    return <div className={pixiDiagramTimeStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: 'auto 5px auto 5px' }}>
            {times.map(t => <TimeDot key={t} time={t} invert={startTime <= t && t <= endTime} onClick={handleStartTimeChange(t)} />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: 'auto 5px auto 5px' }}>
            {times.map(t => <TimeDot key={t} time={t} invert={false} onClick={handleEndTimeChange(t)} />)}
        </div>
    </div>;
}

interface TimeDotProps {
    time: number;
    invert: boolean;
    onClick: () => void;
}

export const TimeDot: React.FC<TimeDotProps> = props => {
    return <div onClick={props.onClick} className={timeDotStyle + (props.invert ? ' ' + invertStyle : '')}>{props.time % 3600 === 0 ? props.time / 3600 : ''}</div>;
}