import { configureStore, createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        overlayMode: 'none',
    },
    reducers: {
        setOverlayMode: (state, action) => {
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
