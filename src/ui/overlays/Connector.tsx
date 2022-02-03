import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { OverlayController } from './OverlayController';
import { RootState } from './store';
import { connectorStyle } from './styles';

interface Props { };

const overlayController = OverlayController.getInstance();

export const Connector: React.FC<Props> = props => {
    const { overlayMode: mode, stationList, selectedStation, arrivingVariantList, departingVariantList } = useSelector((state: RootState) => state.overlay);

    const whenConnector = mode === 'connector' ? 'visible' : 'hidden';

    const handleStationChange = useCallback((event: any) => {
        const selectedId = event.target.value;
        overlayController.selectStation(selectedId);
    }, []);

    return <div className={connectorStyle} style={{ visibility: whenConnector }}>
        <div>
            <select size={1} onChange={handleStationChange} value={selectedStation?.id}>
                <option value={'no-station'}>Select a station</option>
                {stationList.map(station => <option key={station.id} value={station.id}>{station.name}</option>)}
            </select>
        </div>
        <div>
            <div>Arriving:</div>
            {arrivingVariantList.map(vl => <div key={vl.id}>{vl.name} from {vl.firstStationName}</div>)}
        </div>
        <div>
            <div>Departing:</div>
            {departingVariantList.map(vl => <div key={vl.id}>{vl.name} to {vl.lastStationName}</div>)}
        </div>
        <hr />
    </div>;
}
