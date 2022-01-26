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
    selectedRoute: string,
    routeList: StorableRoute[],
}

const initialState: OverlayState = {
    overlayMode: 'none',
    selectedRoute: null,
    routeList: [],
};

export const overlaySlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setOverlayMode: (state, action: PayloadAction<string>) => {
            state.overlayMode = action.payload
        },
        selectRoute: (state, action: PayloadAction<string>) => {
            state.selectedRoute = action.payload
        },
        updateRouteList: (state, action: PayloadAction<StorableRoute[]>) => {
            state.routeList = action.payload
        },
    },
})

export const { setOverlayMode, selectRoute, updateRouteList } = overlaySlice.actions

export const overlayStore = configureStore({
    reducer: {
        overlay: overlaySlice.reducer
    },
});

export type RootState = ReturnType<typeof overlayStore.getState>
export type AppDispatch = typeof overlayStore.dispatch
