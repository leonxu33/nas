import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
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
    const [selectedFile, setSelectedFile] = useState("");
    const [cookie, setCookie] = useCookies()
    const navigate = useNavigate();
    const progress = useSelector(state => state.fileUploader.uploadProgress)
    const dispatch = useDispatch()

    const handleClose = () => {
        props.setShow(false);
        setSelectedFile("")
    }

    const onSelectedFile = (e) => {
        let filePath = e.target.files[0]
        setSelectedFile(filePath)
    }

    const onSubmit = () => {
        if (selectedFile !== "") {
            const uploadId = uuidv4()
            if (uploadId in progress) {
                console.log("existed: ", uploadId)
                return
            }

            let queryUrl = upload_api + "?key=" + props.curDir.join("/")
            let formData = new FormData();
            formData.append('uploadFile', selectedFile)
            const cancelSource = axios.CancelToken.source()

            dispatch(addToUpload({
                id: uploadId,
                file: selectedFile.name,
                dir: props.curDir,
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
                } catch (err) {console.log(err)}
                dispatch(updateProgressWhenFailed({
                    id: uploadId,
                    errMsg: errMsg
                }))
            })
            handleClose()
        }
    }

    return (
        <div>
            <Modal show={props.show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload to {"/root/" + props.curDir.join("/")}</Form.Label>
                            <Form.Control type="file" onChange={onSelectedFile} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={onSubmit}>Upload</Button>
                </Modal.Footer>
            </Modal>
        </div>
        
    );
}
