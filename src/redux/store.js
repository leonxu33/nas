import { configureStore } from '@reduxjs/toolkit'
import uploadFileReducer from './uploadFile/uploadFileSlice'
import fileListReducer from './fileList/fileListSlice'
import alertReducer from './alert/alertSlice'

export default configureStore({
    reducer: {
        fileUploader: uploadFileReducer,
        fileList: fileListReducer,
        alert: alertReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
})