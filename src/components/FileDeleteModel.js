import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dir_api } from "../handlers/api";
import { notifyAlert } from "../redux/alert/alertSlice";
import alertType from "../redux/alert/alertType";

export default function FileDeleteModel(props) {
    const [cookie, setCookie] = useCookies()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleClose = () => props.setShow(false);

    const onSubmitDelete = () => {
        let queryUrl = dir_api + "?key=" + props.filePath
        axios.delete(
            queryUrl,
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
    }

    return (
        <Modal show={props.show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure to delete {props.filePath} ?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onSubmitDelete}>DELETE!</Button>
            </Modal.Footer>
        </Modal>
    );
}