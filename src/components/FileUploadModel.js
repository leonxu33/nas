import React, { useState } from 'react';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux'
import { addToUpload, updateProgress, updateProgressWhenSuccess, updateProgressWhenFailed, removeAll } from '../redux/uploadFile/uploadFileSlice'
import { useCookies } from 'react-cookie';
import { upload_api } from '../handlers/api';
import { useNavigate } from 'react-router-dom';
import alertType from '../redux/alert/alertType';
import { notifyAlert } from '../redux/alert/alertSlice';

export default function FileUploadModel(props) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [cookie] = useCookies()
    const navigate = useNavigate();
    const progress = useSelector(state => state.fileUploader.uploadProgress)
    const curDir = useSelector(state => state.fileList.curDir)
    const dispatch = useDispatch()

    const onClose = () => {
        props.setShow(false);
        setSelectedFiles([])
    }

    const onSelectedFile = (e) => {
        setSelectedFiles(e.target.files)
    }

    const upload = (file) => {
        const uploadId = uuidv4()
        if (uploadId in progress) {
            return
        }

        let queryUrl = upload_api + "?key=" + curDir.join("/")
        let formData = new FormData();
        formData.append('uploadFile', file)
        const cancelSource = axios.CancelToken.source()

        dispatch(addToUpload({
            id: uploadId,
            file: file.name,
            dir: curDir,
            cancelSource: cancelSource
        }))

        axios.post(
            queryUrl,
            formData,
            {
                headers: {
                    "Content-type": "multipart/form-data",
                    "Authorization": `Bearer ${cookie.token}`,
                },
                onUploadProgress: (progressEvent) => {
                    dispatch(updateProgress({
                        id: uploadId,
                        progress: {
                            percent: Math.floor((progressEvent.loaded * 100) / progressEvent.total),
                            completed: progressEvent.loaded,
                            total: progressEvent.total,
                        }
                    }))
                },
                cancelToken: cancelSource.token
            }
        ).then(res => {
            dispatch(updateProgressWhenSuccess({
                id: uploadId
            }))
            props.handleRefresh()
        }).catch(err => {
            console.log(err);
            let errMsg = err.message
            try {
                if (err.response !== undefined && err.response.data !== undefined && err.response.data !== "") {
                    errMsg = err.response.data
                }
                dispatch(notifyAlert({
                    type: alertType.ERROR,
                    message: errMsg
                }))
                if (err.response.status === 401) {
                    dispatch(removeAll())
                    navigate('/')
                }
            } catch (err) { }
            dispatch(updateProgressWhenFailed({
                id: uploadId,
                errMsg: errMsg
            }))
        })
    }

    const onSubmit = () => {
        Object.entries(selectedFiles).forEach(([_, value]) => (
            upload(value)
        ))
        onClose()
    }

    const UploadFileList = () => {
        if (selectedFiles.length <= 1) {
            return (
                <></>
            )
        }
        return (
            <ListGroup className='filelist-popup'>
                {Object.entries(selectedFiles).map(([key, value]) => (
                    <ListGroup.Item key={key}>{value.name}</ListGroup.Item>
                ))}
            </ListGroup>
        )
    }

    return (
        <div>
            <Modal show={props.show} onHide={onClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload to {"/root/" + curDir.join("/")}</Form.Label>
                            <Form.Control type="file" multiple onChange={onSelectedFile} />
                        </Form.Group>
                    </Form>
                    <UploadFileList />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={onSubmit}>Upload</Button>
                </Modal.Footer>
            </Modal>
        </div>

    );
}
