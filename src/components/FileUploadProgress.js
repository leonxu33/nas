import React, { useEffect, useState } from 'react';
import { Card, CloseButton, ListGroup, ProgressBar, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import uploadStatusCode from '../redux/uploadFile/uploadStatusCode';
import { removeAll } from '../redux/uploadFile/uploadFileSlice';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { bytesToSize } from '../handlers/utils';

export default function FileUploaderProgress(props) {
    const [activeCloseButton, setActiveCloseButton] = useState(true)
    const dispatch = useDispatch()
    const progress = useSelector(state => state.fileUploader.uploadProgress)
    const uploadIds = Object.keys(progress)

    const onUploadClose = () => {
        dispatch(removeAll())
    }

    useEffect(() => {
        let isInProgress = false
        uploadIds.forEach(id => {
            if (progress[id].status === uploadStatusCode.IN_PROGRESS) {
                isInProgress = isInProgress || true
            }
        })
        setActiveCloseButton(!isInProgress)
    }, [progress])

    if (Object.keys(uploadIds).length === 0) {
        return (<></>)
    }
    return (
        <div className="downloader">
            <Card>
                <Card.Header>
                    <span>Upload Progress</span>
                    <CloseButton variant="white" className='uploadCloseButton' onClick={onUploadClose} disabled={!activeCloseButton} ></CloseButton>
                    
                </Card.Header>
                <Card.Body>
                    <ListGroup>
                        {uploadIds.map((id) => (
                            <FileUploaderItem key={id} uploadInfo={progress[id]} />
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    );
}

const FileUploaderItem = (props) => {
    //console.log("FileUploaderItem", props.uploadInfo)

    const onCancellation = () => {
        const cs = props.uploadInfo.cancelSource
        cs.cancel()
    }

    if (props.uploadInfo === null || props.uploadInfo.id === null) {
        return <></>
    }

    return (
        <ListGroup.Item>
            <div className="row">
                <div className="col-12 d-flex">
                    <div className="d-inline font-weight-bold text-truncate">{props.uploadInfo.file}</div>
                    <div className="d-inline ml-2">
                        <small>
                            {props.uploadInfo.progress.completed > 0 && (
                                <>
                                    {bytesToSize(props.uploadInfo.progress.completed)}/{bytesToSize(props.uploadInfo.progress.total)}
                                </>
                            )}
                            {props.uploadInfo.status === uploadStatusCode.PENDING && <>Preparing...</>}
                        </small>
                    </div>
                    <div className="d-inline ml-2 ml-auto">
                        {props.uploadInfo.status === uploadStatusCode.IN_PROGRESS && (
                            <CloseButton onClick={() => onCancellation(props.uploadInfo.id)}></CloseButton>
                        )}
                        {props.uploadInfo.status === uploadStatusCode.SUCCESS && (
                            <span className="text-success">
                                Completed
                                {/* Completed <FontAwesomeIcon icon="check-circle" /> */}
                            </span>
                        )}
                        {props.uploadInfo.status === uploadStatusCode.FAILED && (
                            <span className="text-danger">
                                {props.uploadInfo.errMsg}
                            </span>
                        )}
                    </div>
                </div>
                <div className="col-12 mt-2">
                    {props.uploadInfo.status === uploadStatusCode.IN_PROGRESS && <ProgressBar
                        variant="success"
                        now={props.uploadInfo.progress.percent}
                        striped={true}
                        label={`${props.uploadInfo.progress.percent}%`}
                    />}
                </div>
            </div>
        </ListGroup.Item>
    );
}