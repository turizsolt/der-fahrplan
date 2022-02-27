import React from 'react';
import { getContrastColor, routeNameStyle } from './styles';

interface Props {
    routeName: string;
    routeColor: string;
};

export const RouteSign: React.FC<Props> = props => {
    const { routeName, routeColor } = props;

    return <div className={routeNameStyle} style={{ backgroundColor: routeColor, color: getContrastColor(routeColor) }}>
        {routeName}
    </div>;
}
