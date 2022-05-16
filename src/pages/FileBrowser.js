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

export default function FileBrowser() {
    const [fileList, setFileList] = useState(null)
    const [curDir, setCurDir] = useState([])
    const [search, setSearch] = useSearchParams()
    const [cookie, setCookie] = useCookies()
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
                setFileList(res.data.metadatas)
                setCurDir(res.data.queryFolder.split("/").filter(element => element))
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
    }

    return (
        <div className="body">
            <h3 className="spacer">File Browser</h3>
            <FileToolBar handleRefresh={onRefreshFileList} curDir={curDir} />
            <FileList handleRefresh={onRefreshFileList} fileList={fileList} curDir={curDir} />
            <FileUploaderProgress />
        </div>
    );
}
