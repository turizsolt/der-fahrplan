import { Util } from "../Util";

export type TimeOrHeadway = { type: 'time', time: number } | { type: 'headway', headway: number };

export const textToTimesOrHeadways = (text: string): TimeOrHeadway[] => {
    const times: TimeOrHeadway[] = [];

    const regex = /([^-\s]+)/g;
    let matches;
    while (matches = regex.exec(text)) {
        const chunk = matches[1];

        if (chunk.match(/^[0-9]{1,2}:[0-9]{2}(\.[0-9]{1,2})?$/)) {
            times.push({ type: 'time', time: Util.stringToTime(chunk) });
        } else if (chunk.match(/^[0-9]{1,3}(\.[0-9]{1,2})?$/)) {
            times.push({ type: 'headway', headway: Util.stringToTime(chunk) });
        }
    }

    return times;
};

export const timesOrHeadwaysToText = (timesOrHeadways: TimeOrHeadway[]): string => {
    let text: string = '';
    for (const toh of timesOrHeadways) {
        if (toh.type === 'time') {
            text += Util.timeToString(toh.time) + '\n';
        } else {
            text += Util.timeToStringNoHour(toh.headway) + '\n';
        }
    }
    return text;
};

export const timesOrHeadwaysToTimes = (timeOrHeadways: TimeOrHeadway[]): number[] => {
    const times: number[] = [];
    let lastTime: number = 4 * 3600;
    let lastIntervals: number[] = [];

    for (const toh of timeOrHeadways) {
        if (toh.type === 'time') {
            if (toh.time > lastTime) {
                if (lastIntervals.length > 0) {
                    let i = 0;
                    let nextTime = lastTime + lastIntervals[i];
                    i = (i + 1) % lastIntervals.length;
                    while (nextTime <= (toh.time - lastIntervals[i])) {
                        times.push(nextTime);
                        nextTime += lastIntervals[i];
                        i = (i + 1) % lastIntervals.length;
                    }
                }

                times.push(toh.time);
                lastTime = toh.time;
                lastIntervals = [];
            }
        } else {
            lastIntervals.push(toh.headway);
        }
    }

    return times;
};
