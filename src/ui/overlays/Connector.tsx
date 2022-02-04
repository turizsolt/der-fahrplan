import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { TripWithEnd } from '../../structs/Scheduling/TripWithEnd';
import { Util } from '../../structs/Util';
import { OverlayController } from './OverlayController';
import { RouteSign } from './RouteSign';
import { RootState } from './store';
import { connectorEndStyle, connectorFullEndStyle, connectorLeftStyle, connectorMiddleEndStyle, connectorMiddleStyle, connectorNotEndStyle, connectorRightStyle, connectorStyle, connectorTopStyle } from './styles';

interface Props { };

const overlayController = OverlayController.getInstance();

export const Connector: React.FC<Props> = props => {
    const { overlayMode: mode, stationList, selectedStation, arrivingVariantList, departingVariantList,
        selectedArrivingVariantList, selectedDepartingVariantList, dualTripList } = useSelector((state: RootState) => state.overlay);

    const whenConnector = mode === 'connect' ? 'visible' : 'hidden';

    const [minAuto, setMinAuto] = useState<string>('');
    const [maxAuto, setMaxAuto] = useState<string>('');

    const handleMinAutoChange = useCallback((event: any) => {
        setMinAuto(event.target.value);
    }, []);

    const handleMaxAutoChange = useCallback((event: any) => {
        setMaxAuto(event.target.value);
    }, []);

    const handleStationChange = useCallback((event: any) => {
        const selectedId = event.target.value;
        overlayController.selectStation(selectedId);
    }, []);

    const handleArrivingVariantsChange = useCallback((event: any) => {
        const selectedArrivings = Array.from(event.target.selectedOptions, (option: any) => option.value);
        overlayController.selectArrivings(selectedArrivings);
    }, []);

    const handleDepartingVariantsChange = useCallback((event: any) => {
        const selectedDepartings = Array.from(event.target.selectedOptions, (option: any) => option.value);
        overlayController.selectDepartings(selectedDepartings);
    }, []);

    const handleSelectAllVariants = useCallback(() => {
        overlayController.selectArrivings(arrivingVariantList.map(v => v.id));
        overlayController.selectDepartings(departingVariantList.map(v => v.id));
    }, [arrivingVariantList, departingVariantList]);

    const handleSelectNoneVariants = useCallback(() => {
        overlayController.selectArrivings([]);
        overlayController.selectDepartings([]);
    }, []);

    const [from, setFrom] = useState<string>(null);

    const handleFromTrip = useCallback((tripId: string) => () => {
        if (tripId) {
            setFrom(tripId);
        }
    }, []);

    const handleToTrip = useCallback((tripId: string) => () => {
        if (tripId && from) {
            overlayController.connectTrip(from, tripId);
            setFrom(null);
        }
    }, [from]);

    const handleDetachTrip = useCallback((fromId: string, toId: string) => () => {
        if (fromId && toId) {
            overlayController.detachTrip(fromId, toId);
        }
    }, []);

    const handleAutoConnect = useCallback(() => {
        overlayController.autoConnect(minAuto, maxAuto);
    }, [minAuto, maxAuto]);

    const handleAutoDisconnect = useCallback(() => {
        overlayController.autoDisconnect();
    }, []);

    return <div className={connectorStyle} style={{ visibility: whenConnector }}>
        <div className={connectorTopStyle}>
            <select size={1} onChange={handleStationChange} value={selectedStation?.id}>
                <option value={'no-station'}>Select a station</option>
                {stationList.map(station => <option key={station.id} value={station.id}>{station.name}</option>)}
            </select>
        </div>
        <div className={connectorLeftStyle}>
            <div>Arriving:</div>
            <select multiple onChange={handleArrivingVariantsChange} size={arrivingVariantList.length} value={selectedArrivingVariantList}>
                {arrivingVariantList.map(vl => <option key={vl.id} value={vl.id}>{vl.name} from {vl.firstStationName}</option>)}
            </select>
            <hr />
            <button onClick={handleSelectAllVariants}>Select all</button>
            <button onClick={handleSelectNoneVariants}>Select none</button>
        </div>
        <div className={connectorMiddleStyle}>
            {dualTripList.map((dual, index) => <div key={index}>
                <div style={{ display: 'flex' }}>
                    <TripLast trip={dual.Last} />
                    {dual.First && dual.Last && <div className={connectorFullEndStyle} onClick={handleDetachTrip(dual.Last?.trip.id, dual.First?.trip.id)}>connected</div>}
                    {(!dual.First || !dual.Last) && <>
                        <div className={dual.Last ? connectorEndStyle : connectorNotEndStyle} onClick={dual.Last?.trip.nextTrip ? handleDetachTrip(dual.Last?.trip.id, dual.Last?.trip.nextTrip) : handleFromTrip(dual.Last?.trip.id)}>{from === dual.Last?.trip.id ? 'from' : dual.Last?.trip.nextTrip}</div>
                        <div className={connectorMiddleEndStyle}></div>
                        <div className={dual.First ? connectorEndStyle : connectorNotEndStyle} onClick={dual.First?.trip.prevTrip ? handleDetachTrip(dual.First?.trip.prevTrip, dual.First?.trip.id) : handleToTrip(dual.First?.trip.id)}>{dual.First?.trip.prevTrip}</div>
                    </>}
                    <TripFirst trip={dual.First} />
                </div>
            </div>)}
        </div>
        <div className={connectorRightStyle}>
            <div>Departing:</div>
            <select multiple onChange={handleDepartingVariantsChange} size={departingVariantList.length} value={selectedDepartingVariantList}>
                {departingVariantList.map(vl => <option key={vl.id} value={vl.id}>{vl.name} to {vl.lastStationName}</option>)}
            </select>
            <hr />
            <button onClick={handleAutoConnect}>Auto</button><br />
            <button onClick={handleAutoDisconnect}>Dis all</button><br />
            <input type="text" value={minAuto} onChange={handleMinAutoChange} placeholder="min" /><br />
            <input type="text" value={maxAuto} onChange={handleMaxAutoChange} placeholder="max" />
        </div>
    </div>;
}

type THProps = {
    trip: TripWithEnd;
};

export const TripLast: React.FC<THProps> = props => {
    const { trip } = props;

    return <div style={{ display: 'flex', width: 'calc(50% - 90px)', justifyContent: 'flex-end' }}>
        {trip && <>
            <div>{trip.trip.firstStationName}</div>
            <RouteSign routeColor={trip.trip.color} routeName={trip.trip.name} />
            <div>{Util.timeToString(trip.time)}</div>
        </>}
    </div>;
}

export const TripFirst: React.FC<THProps> = props => {
    const { trip } = props;

    return <div style={{ display: 'flex', width: 'calc(50% - 90px)', justifyContent: 'flex-start' }}>
        {trip && <>
            <div>{Util.timeToString(trip.time)}</div>
            <RouteSign routeColor={trip.trip.color} routeName={trip.trip.name} />
            <div>{trip.trip.firstStationName}</div>
        </>}
    </div>;
}