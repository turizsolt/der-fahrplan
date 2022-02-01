import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    keyVersion: number
}

const initialState: OverlayState = {
    overlayMode: 'none',
    selectedRoute: null,
    routeList: [],
    createExpress: false,
    startTime: parseInt(localStorage.getItem('startTime'), 10) || 4 * 3600,
    endTime: parseInt(localStorage.getItem('endTime'), 10) || 7 * 3600,
    selectedTripStop: null,
    keyVersion: 0
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
        updateRouteList: (state, action: PayloadAction<StorableRoute[]>) => {
            state.routeList = action.payload;
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
    },
})

export const { setOverlayMode, selectRoute, updateRouteList, setCreateExpress, setStartTime, setEndTime, setSelectedTripStop, incrementKeyVersion } = overlaySlice.actions

export const overlayStore = configureStore({
    reducer: {
        overlay: overlaySlice.reducer
    },
});

export type RootState = ReturnType<typeof overlayStore.getState>
export type AppDispatch = typeof overlayStore.dispatch
