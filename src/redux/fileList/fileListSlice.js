import { createSlice } from "@reduxjs/toolkit";

export const fileListSlice = createSlice({
    name: 'fileList',
    initialState: {
        fileList: [],
        curDir: [],
        selectedFiles: []
    },
    reducers: {
        updateFileList: (state, action) => {
            state.fileList = action.payload
        },
        sortFileList: (state, action) => {
            let key = action.payload.sortKey
            let isAscendMultiplier = action.payload.isAscend ? 1 : -1
            state.fileList.sort((a, b) => {
                if (a[key] == b[key]) return 0 * isAscendMultiplier;
                if (a[key] < b[key]) return -1 * isAscendMultiplier;
                if (a[key] > b[key]) return 1 * isAscendMultiplier;
            })
        },
        setCurDir: (state, action) => {
            state.curDir = action.payload
        },
        addToSelectedFiles: (state, action) => {
            const foundIndex = state.selectedFiles.findIndex(filename => filename === action.payload)
            if (foundIndex === -1) {
                state.selectedFiles.push(action.payload)
            }
        },
        removeFromSelectedFiles: (state, action) => {
            state.selectedFiles = state.selectedFiles.filter(item => item !== action.payload)
        },
        removeAllSelectedFiles: (state) => {
            state.selectedFiles = []
        }
    },
})

export const { updateFileList, sortFileList, setCurDir, addToSelectedFiles, removeFromSelectedFiles, removeAllSelectedFiles } = fileListSlice.actions
export default fileListSlice.reducer