import { createSlice } from "@reduxjs/toolkit";

export const alertSlice = createSlice({
    name: 'alert',
    initialState: {
        alert: {
            /*
            type: alertType
            message: string
            */
        }
    },
    reducers: {
        notifyAlert: (state, action) => {
            state.alert = action.payload
        }
    },
})

export const { notifyAlert } = alertSlice.actions
export default alertSlice.reducer