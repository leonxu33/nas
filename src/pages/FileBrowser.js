import React, { useEffect, useState } from 'react';
import axios from "axios";
import FileList from '../components/FileList';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FileToolBar from '../components/FileToolBar';
import FileUploaderProgress from '../components/FileUploadProgress';
import { useCookies } from 'react-cookie';
import { dir_api } from '../handlers/api';
import { useDispatch, useSelector } from 'react-redux';
import { notifyAlert } from '../redux/alert/alertSlice';
import alertType from '../redux/alert/alertType';
import { removeAllSelectedFiles, setCurDir, updateFileList } from '../redux/fileList/fileListSlice';
import { splitRemoveEmpty } from '../handlers/utils';

export default function FileBrowser() {
    const [search] = useSearchParams()
    const [cookie] = useCookies()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        onRefreshFileList()
    }, [search])

    const onRefreshFileList = () => {
        let queryUrl = dir_api
        let prefix = search.get("prefix")
        if (prefix !== null && prefix !== "") {
            queryUrl = queryUrl+"?key="+prefix
        }
        axios.get(queryUrl,
            {
                headers: {
                    "Authorization": `Bearer ${cookie.token}`,
                }
            },)
            .then(res => {
                dispatch(updateFileList(res.data.metadatas))
                dispatch(setCurDir(splitRemoveEmpty(res.data.queryFolder, "/")))
            }).catch(err => {
                console.log(err);
                try {
                    let errMsg = err.message
                    if (err.response.data !== undefined && err.response.data !== "") {
                        errMsg = err.response.data
                    }
                    dispatch(notifyAlert({
                        type: alertType.ERROR,
                        message: errMsg
                    }))
                    if (err.response.status === 401) {
                        navigate('/')
                    }
                } catch (err) {console.log(err)}
            })
        dispatch(removeAllSelectedFiles())
    }

    return (
        <div className="body">
            <FileToolBar handleRefresh={onRefreshFileList} />
            <FileList handleRefresh={onRefreshFileList} />
            <FileUploaderProgress />
        </div>
    );
}
