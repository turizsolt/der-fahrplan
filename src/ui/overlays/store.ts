import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OverlayState {
    overlayMode: string,
    routeList: string[]
}

const initialState: OverlayState = {
    overlayMode: 'none',
    routeList: [],
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setOverlayMode: (state, action: PayloadAction<string>) => {
            state.overlayMode = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setOverlayMode } = counterSlice.actions

export const overlayStore = configureStore({
    reducer: {
        overlay: counterSlice.reducer
    },
});

export type RootState = ReturnType<typeof overlayStore.getState>
export type AppDispatch = typeof overlayStore.dispatch
