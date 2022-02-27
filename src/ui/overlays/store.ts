import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TripEnd } from '../../structs/Scheduling/TripEnd';
import { TripWithEnd } from '../../structs/Scheduling/TripWithEnd';

export interface StorableRoute {
    id: string,
    type: string,
    name: string,
    detailedName: string,
    fistStationName: string,
    lastStationName: string,
    color: string,
    variants: string[]
};

export interface StorableRouteVariant {
    id: string;
    type: string;
    name: string;
    firstStationId: string;
    firstStationName: string;
    lastStationId: string;
    lastStationName: string;
    color: string;
}

export interface StorableStation {
    id: string;
    name: string;
}

export interface OverlayState {
    overlayMode: string,
    selectedRoute: StorableRoute,
    routeList: StorableRoute[],
    createExpress: boolean,
    startTime: number,
    endTime: number,
    selectedTripStop: {
        tripId: string,
        routePartNo: number
    },
    keyVersion: number,
    routeVariantList: StorableRouteVariant[],
    selectedStation: StorableStation,
    arrivingVariantList: StorableRouteVariant[],
    departingVariantList: StorableRouteVariant[],
    selectedArrivingVariantList: string[],
    selectedDepartingVariantList: string[],
    stationList: StorableStation[],
    dualTripList: Record<TripEnd, TripWithEnd>[]
}

const initialState: OverlayState = {
    overlayMode: 'none',
    selectedRoute: null,
    routeList: [],
    createExpress: false,
    startTime: parseInt(localStorage.getItem('startTime'), 10) || 4 * 3600,
    endTime: parseInt(localStorage.getItem('endTime'), 10) || 7 * 3600,
    selectedTripStop: null,
    keyVersion: 0,
    routeVariantList: [],
    arrivingVariantList: [],
    departingVariantList: [],
    selectedArrivingVariantList: [],
    selectedDepartingVariantList: [],
    selectedStation: null,
    stationList: [],
    dualTripList: []
};

export const overlaySlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setOverlayMode: (state, action: PayloadAction<string>) => {
            state.overlayMode = action.payload;
        },
        selectRoute: (state, action: PayloadAction<StorableRoute>) => {
            state.selectedRoute = action.payload;
        },
        updateRouteList: (state, action: PayloadAction<{ routeList: StorableRoute[], routeVariantList: StorableRouteVariant[] }>) => {
            state.routeList = action.payload.routeList;
            state.routeVariantList = action.payload.routeVariantList;
        },
        updateStationList: (state, action: PayloadAction<StorableStation[]>) => {
            state.stationList = action.payload;
        },
        setCreateExpress: (state, action: PayloadAction<boolean>) => {
            state.createExpress = action.payload;
        },
        setStartTime: (state, action: PayloadAction<number>) => {
            const duration = state.endTime - state.startTime;
            state.startTime = action.payload;
            state.endTime = Math.min(action.payload + duration, 24 * 3600);

            localStorage.setItem('startTime', state.startTime.toString());
            localStorage.setItem('endTime', state.endTime.toString());
        },
        setEndTime: (state, action: PayloadAction<number>) => {
            if (action.payload > state.startTime) {
                state.endTime = action.payload;

                localStorage.setItem('endTime', state.endTime.toString());
            }
        },
        setSelectedTripStop: (state, action: PayloadAction<{
            tripId: string,
            routePartNo: number
        }>) => {
            state.selectedTripStop = action.payload
        },
        incrementKeyVersion: (state, action: PayloadAction<void>) => {
            state.keyVersion++
        },
        setSelectedStation: (state, action: PayloadAction<{ station: StorableStation, arrivingVariantList: StorableRouteVariant[], departingVariantList: StorableRouteVariant[] }>) => {
            state.selectedStation = action.payload.station;
            state.arrivingVariantList = action.payload.arrivingVariantList;
            state.departingVariantList = action.payload.departingVariantList;
        },
        setSelectedDepartingList: (state, action: PayloadAction<string[]>) => {
            state.selectedDepartingVariantList = action.payload;
        },
        setSelectedArrivingList: (state, action: PayloadAction<string[]>) => {
            state.selectedArrivingVariantList = action.payload;
        },
        setDualTripList: (state, action: PayloadAction<Record<TripEnd, TripWithEnd>[]>) => {
            state.dualTripList = action.payload;
        },
    },
})

export const { setOverlayMode, selectRoute, updateStationList, updateRouteList, setCreateExpress,
    setStartTime, setEndTime, setSelectedTripStop, incrementKeyVersion, setSelectedStation,
    setSelectedArrivingList, setSelectedDepartingList, setDualTripList } = overlaySlice.actions

export const overlayStore = configureStore({
    reducer: {
        overlay: overlaySlice.reducer
    },
});

export type RootState = ReturnType<typeof overlayStore.getState>
export type AppDispatch = typeof overlayStore.dispatch
