import axios from 'axios';
import React, { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FileDeleteModel from './FileDeleteModel';
import { download_api } from '../handlers/api';
import { useDispatch } from 'react-redux';
import alertType from '../redux/alert/alertType';
import { notifyAlert } from '../redux/alert/alertSlice';
import { truncateText } from '../handlers/utils';

export default function FileElement(props) {
    const [search, setSearch] = useSearchParams();
    const [showDelete, setShowDelete] = useState(false);
    const [cookie, setCookie] = useCookies();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    let objectSize = bytesToSize(props.metadata.size)
    if (props.metadata.type === "Folder") {
        objectSize = ""
    }

    const onSelectedFolder = () => {
        if (props.metadata.type !== "Folder") {
            return
        }
        let newDirArr = [...props.curDir, props.metadata.name]
        const newDirString = "/" + newDirArr.join("/")
        setSearch({ prefix: newDirString })
    }

    const getQueryParams = () => {
        return "?key=" + props.curDir.join("/") + "/" + props.metadata.name
    }

    const onDownload = () => {
        axios.post(download_api + getQueryParams(),
            null,
            {
                headers: {
                    "Authorization": `Bearer ${cookie.token}`,
                }
            },)
            .then(res => {
                const signed = res.data.signed
                const nonce = res.data.nonce

                const downloadLink = document.createElement('a')
                downloadLink.href = `${download_api}?signed=${signed}&nc=${nonce}`
                document.body.appendChild(downloadLink)
                downloadLink.click()
                downloadLink.parentNode.removeChild(downloadLink)
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

    const showAction = (metadata) => {
        if (metadata.type !== "Folder") {
            return (
                <>
                    <Button variant='outline-success' size="sm" onClick={onDownload}> Download</Button>
                    <Button variant='outline-danger' size="sm" onClick={() => setShowDelete(true)}>Delete</Button>
                </>
            );
        }
        return (
            <Button variant='outline-danger' size="sm" onClick={() => setShowDelete(true)}>Delete</Button>
        );
    }

    

    return (
        <>
            <tr>
                <td className='table-filename-section' onClick={onSelectedFolder}>
                    <OverlayTrigger placement='bottom' overlay={<Tooltip>{props.metadata.name}</Tooltip>}>
                    {({ ref, ...triggerHandler }) => (
                        <span {...triggerHandler} ref={ref}>{truncateText(props.metadata.name, 40)}</span>
                    )}
                    </OverlayTrigger>
                </td>
                <td>{props.metadata.type}</td>
                <td>{props.metadata.date}</td>
                <td>{objectSize}</td>
                <td>{showAction(props.metadata)}</td>
            </tr>

            <FileDeleteModel filePath={props.curDir.join("/") + "/" + props.metadata.name} show={showDelete} setShow={setShowDelete} />
        </>

    );
}

const bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}