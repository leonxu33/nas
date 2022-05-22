import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FileDeleteModel from './FileDeleteModel';
import { download_api } from '../handlers/api';
import { useDispatch, useSelector } from 'react-redux';
import alertType from '../redux/alert/alertType';
import { notifyAlert } from '../redux/alert/alertSlice';
import { addToSelectedFiles, removeFromSelectedFiles } from '../redux/fileList/fileListSlice';

export default function FileElement(props) {
    const curDir = useSelector(state => state.fileList.curDir);
    const selectedFiles = useSelector(state => state.fileList.selectedFiles);
    const [search, setSearch] = useSearchParams();
    const [showDelete, setShowDelete] = useState(false);
    const [checked, SetChecked] = useState(false);
    const dispatch = useDispatch();

    let objectSize = bytesToSize(props.metadata.size)
    if (props.metadata.type === "Folder") {
        objectSize = ""
    }

    const onSelectedFolder = () => {
        if (props.metadata.type !== "Folder") {
            return
        }
        let newDirArr = [...curDir, props.metadata.name]
        const newDirString = "/" + newDirArr.join("/")
        setSearch({ prefix: newDirString })
    }

    const onChecked = () => {
        if (!checked) {
            dispatch(addToSelectedFiles(props.metadata.name))
        } else {
            dispatch(removeFromSelectedFiles(props.metadata.name))
        }
        SetChecked(!checked)
    }

    useEffect(() => {
        let filteredFiles = selectedFiles.filter(filename => filename === props.metadata.name)
        if (filteredFiles.length === 0) {
            SetChecked(false)
        } else {
            SetChecked(true)
        }
    }, [selectedFiles])

    return (
        <>
            <tr className='d-flex flex-row'>
                <td className='col-1'><Form.Check checked={checked} type={'checkbox'} onChange={onChecked} /></td>
                <td className='col-5 table-filename-section' onClick={onSelectedFolder}>
                    <OverlayTrigger placement='bottom' overlay={<Tooltip>{props.metadata.name}</Tooltip>}>
                    {({ ref, ...triggerHandler }) => (
                        <span {...triggerHandler} ref={ref}>{props.metadata.name}</span>
                    )}
                    </OverlayTrigger>
                </td>
                <td className='col-2'>{props.metadata.type}</td>
                <td className='col-2'>{props.metadata.date}</td>
                <td className='col-2'>{objectSize}</td>
            </tr>

            <FileDeleteModel filePath={curDir.join("/") + "/" + props.metadata.name} show={showDelete} setShow={setShowDelete} />
        </>

    );
}

const bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}