import React, { useCallback } from 'react';
import { Util } from '../../structs/Util';
import { addTripsStyle, addTripsTextareaStyle } from './styles';

export const DiagramAddTrips: React.FC = () => {
    const handleStopPropagation = useCallback((event: any) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }, []);

    const handleTopTrips = useCallback((event: any) => {
        process(event.target.value);
    }, []);

    const handleBottomTrips = useCallback((event: any) => {
        process(event.target.value);
    }, []);

    return <div className={addTripsStyle}>
        <textarea className={addTripsTextareaStyle} onBlur={handleTopTrips} onKeyDown={handleStopPropagation} onKeyUp={handleStopPropagation}></textarea>
        <textarea className={addTripsTextareaStyle} onBlur={handleBottomTrips} onKeyDown={handleStopPropagation} onKeyUp={handleStopPropagation}></textarea>
    </div>;
}

function process(str: string): number[] {
    const times: number[] = [];

    const regex = /([^-\s]+)/g;
    let matches;

    let lastTime: number = 4 * 3600;
    let lastIntervals: number[] = [];
    while (matches = regex.exec(str)) {
        const chunk = matches[1];

        if (chunk.match(/^[0-9]{1,2}:[0-9]{2}(\.[0-9]{1,2})?$/)) {
            const time = Util.stringToTime(chunk);
            // console.log('time', chunk, time);

            if (time > lastTime) {
                if (lastIntervals.length > 0) {
                    let i = 0;
                    let nextTime = lastTime + lastIntervals[i];
                    i = (i + 1) % lastIntervals.length;
                    while (nextTime <= (time - lastIntervals[i])) {
                        times.push(nextTime);
                        nextTime += lastIntervals[i];
                        i = (i + 1) % lastIntervals.length;
                    }
                }

                times.push(time);
                lastTime = time;
                lastIntervals = [];
            }
        } else if (chunk.match(/^[0-9]{1,3}(\.[0-9]{1,2})?$/)) {
            const time = Util.stringToTime(chunk);
            // console.log('headway', chunk, time);

            lastIntervals.push(time);
        } else {
            // console.log('not recognised', chunk);
        }
    }

    // console.log(times);
    console.log(times.map(t => Util.timeToString(t)));
    return times;
}
