import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from "axios";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { notifyAlert } from '../redux/alert/alertSlice';
import { useDispatch, useSelector } from 'react-redux';
import alertType from '../redux/alert/alertType';
import { dir_api } from '../handlers/api';

export default function CreateFolderModel(props) {
    const [folder, setFolder] = useState("");
    const [cookie] = useCookies();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const curDir = useSelector(state => state.fileList.curDir)

    const handleClose = () => {
        props.setShow(false);
        setFolder("")
    }

    const handleFolderInputChange = (e) => {
        setFolder(e.target.value)
    }

    const onSubmit = () => {
        if (folder !== "") {
            let queryDir = curDir.join("/") + "/" + folder
            let queryUrl = dir_api+"?key="+queryDir
            axios.post(
                queryUrl,
                null,
                {
                    headers: {
                        "Authorization": `Bearer ${cookie.token}`,
                    }
                },
            ).then(res => {
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
            handleClose()
            props.handleRefresh()
        }
    }

    return (
        <div>
            <Modal show={props.show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3" controlId="newFolderName">
                            <Form.Label>New folder at {"/root/" + curDir.join("/")}</Form.Label>
                            <Form.Control type="text" placeholder="folder name" onChange={handleFolderInputChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={onSubmit}>Create</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}