import { createSlice } from '@reduxjs/toolkit'
import uploadStatusCode from './uploadStatusCode'

export const uploadFileSlice = createSlice({
    name: 'fileUploader',
    initialState: {
        uploadProgress: {
            /*
            id: {
                id: uuid,
                file: file,
                dir: string,
                status: uploadStatusCode,
                errMsg: string,
                cancelSource: cancelSource,
                progress: {
                    percent: float,
                    completed: int,
                    total: int,
                }
            }
            */
        }
    },
    reducers: {
        /*
        action: {
            payload: {
                id: int,
                file: file,
                dir: string,
                cancelSource: cancelSource,
            }
        }
        */
        addToUpload: (state, action) => {
            state.uploadProgress = {
                ...state.uploadProgress,
                [action.payload.id]: {
                    id: action.payload.id,
                    file: action.payload.file,
                    dir: action.payload.dir,
                    status: uploadStatusCode.PENDING,
                    errMsg: "",
                    cancelSource: action.payload.cancelSource,
                    progress: {
                        percent: 0,
                        completed: 0,
                        total: 0,
                    }
                },
            }
        },

        /*
        action: {
            payload: {
                id: int,
                progress
            }
        }
        */
        updateProgress: (state, action) => {
            state.uploadProgress = {
                ...state.uploadProgress,
                [action.payload.id]: {
                    ...state.uploadProgress[action.payload.id],
                    status: uploadStatusCode.IN_PROGRESS,
                    progress: action.payload.progress,
                }
            }
        },

        /*
        action: {
            payload: {
                id: int,
            }
        }
        */
        updateProgressWhenSuccess: (state, action) => {
            state.uploadProgress = {
                ...state.uploadProgress,
                [action.payload.id]: {
                    ...state.uploadProgress[action.payload.id],
                    status: uploadStatusCode.SUCCESS
                }
            }
        },

        /*
        action: {
            payload: {
                id: int,
                errCode: int,
                errMsg: string,
            }
        }
        */
        updateProgressWhenFailed: (state, action) => {
            state.uploadProgress = {
                ...state.uploadProgress,
                [action.payload.id]: {
                    ...state.uploadProgress[action.payload.id],
                    status: uploadStatusCode.FAILED,
                    errMsg: action.payload.errMsg
                }
            }
        },
        
        /*
        action: {
            payload: {
                id: int,
            }
        }
        */
        removeFromUpload: (state, action) => {
            delete state.uploadProgress[action.payload.id]
        },

        removeAll: (state) => {
            state.uploadProgress = {}
        },
    }
})

// Action creators are generated for each case reducer function
export const { addToUpload, updateProgress, updateProgressWhenSuccess, updateProgressWhenFailed, removeFromUpload, removeAll } = uploadFileSlice.actions

export default uploadFileSlice.reducer