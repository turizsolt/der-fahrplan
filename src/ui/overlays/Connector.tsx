import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { OverlayController } from './OverlayController';
import { RootState } from './store';
import { connectorStyle } from './styles';

interface Props { };

const overlayController = OverlayController.getInstance();

export const Connector: React.FC<Props> = props => {
    const { overlayMode: mode, stationList, selectedStation, arrivingVariantList, departingVariantList,
        selectedArrivingVariantList, selectedDepartingVariantList } = useSelector((state: RootState) => state.overlay);

    const whenConnector = mode === 'connector' ? 'visible' : 'hidden';

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

    return <div className={connectorStyle} style={{ visibility: whenConnector }}>
        <div>
            <select size={1} onChange={handleStationChange} value={selectedStation?.id}>
                <option value={'no-station'}>Select a station</option>
                {stationList.map(station => <option key={station.id} value={station.id}>{station.name}</option>)}
            </select>
        </div>
        <div>
            <div>Arriving:</div>
            <select multiple onChange={handleArrivingVariantsChange} size={arrivingVariantList.length} value={selectedArrivingVariantList}>
                {arrivingVariantList.map(vl => <option key={vl.id} value={vl.id}>{vl.name} from {vl.firstStationName}</option>)}
            </select>
        </div>
        <div>
            <div>Departing:</div>
            <select multiple onChange={handleDepartingVariantsChange} size={departingVariantList.length} value={selectedDepartingVariantList}>
                {departingVariantList.map(vl => <option key={vl.id} value={vl.id}>{vl.name} to {vl.lastStationName}</option>)}
            </select>
        </div>
        <button onClick={handleSelectAllVariants}>Select all</button>
        <button onClick={handleSelectNoneVariants}>Select none</button>
        <hr />
    </div>;
}
