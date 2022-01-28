import React from 'react';
import { createRouteStyle, getContrastColor, routeNameStyle, routeStyle, routeTerminiStyle } from './styles';

interface Props {
    routeName: string;
    routeColor: string;
    startStationName: string;
    endStationName: string;
    selected: boolean;
    onSelect: () => void;
};

export const Route: React.FC<Props> = props => {
    const { routeName, routeColor, startStationName, endStationName, selected, onSelect } = props;

    return <div className={routeStyle} onClick={onSelect} style={{ backgroundColor: selected ? '#8a8' : '#cec' }}>
        <div className={routeNameStyle} style={{ backgroundColor: routeColor, color: getContrastColor(routeColor) }}>{routeName}</div>
        <div className={routeTerminiStyle}>
            <span>{startStationName}</span>
            {endStationName && startStationName !== endStationName && <><br /><span>{endStationName}</span></>}
        </div>
    </div>;
}


interface CreateProps {
    onSelect: () => void;
};

export const RouteCreator: React.FC<CreateProps> = props => {
    const { onSelect } = props;

    return <div className={routeStyle} onClick={onSelect}>
        <div className={createRouteStyle}>Create Route</div>
    </div>;
}
