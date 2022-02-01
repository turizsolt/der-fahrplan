import React, { useCallback } from 'react';
import { getStorable } from '../../structs/Actuals/Store/StoreForVue';
import { RouteVariant } from '../../structs/Scheduling/RouteVariant';
import { textToTimesOrHeadways, timesOrHeadwaysToText, timesOrHeadwaysToTimes } from '../../structs/Scheduling/TimeOrHeadway';
import { Util } from '../../structs/Util';
import { OverlayController } from './OverlayController';
import { StorableRoute } from './store';
import { addTripsStyle, addTripsTextareaStyle } from './styles';

const overlayController = OverlayController.getInstance();

interface Props {
    route: StorableRoute;
};

export const DiagramAddTrips: React.FC<Props> = (props) => {
    const { route } = props;

    const text0 = route && timesOrHeadwaysToText((getStorable(route.variants[0]) as RouteVariant).getTimesOrHeadways());
    const text1 = route && timesOrHeadwaysToText((getStorable(route.variants[1]) as RouteVariant).getTimesOrHeadways());

    const handleStopPropagation = useCallback((event: any) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }, []);

    const handleTopTrips = useCallback((event: any) => {
        process(event.target.value, route.variants[0]);
        overlayController.updateDiagram();
    }, []);

    const handleBottomTrips = useCallback((event: any) => {
        process(event.target.value, route.variants[1]);
        overlayController.updateDiagram();
    }, []);

    return <div className={addTripsStyle}>
        {route && <>
            <textarea
                className={addTripsTextareaStyle}
                onBlur={handleTopTrips}
                onKeyDown={handleStopPropagation}
                onKeyUp={handleStopPropagation}
                defaultValue={text0}
            ></textarea>
            <textarea
                className={addTripsTextareaStyle}
                onBlur={handleBottomTrips}
                onKeyDown={handleStopPropagation}
                onKeyUp={handleStopPropagation}
                defaultValue={text1}
            ></textarea>
        </>}
    </div>;
}

function process(str: string, routeVariantId: string): void {
    const routeVariant = (getStorable(routeVariantId) as RouteVariant);
    const toh = textToTimesOrHeadways(str);
    routeVariant.updateTimeCode(toh);

    // todo optional
    const times = timesOrHeadwaysToTimes(toh);
    console.log(times.map(t => Util.timeToString(t)));
}
