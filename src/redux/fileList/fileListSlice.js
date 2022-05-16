import { createSlice } from "@reduxjs/toolkit";

export const fileListSlice = createSlice({
    name: 'fileList',
    initialState: {
        fileList: null
    },
    reducers: {
        updateFileList: (state, action) => {
            state.fileList = action.payload.fileList
        }
    },
})

export const { updateFileList } = fileListSlice.actions
export default fileListSlice.reducer