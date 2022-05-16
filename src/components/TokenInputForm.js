import axios from 'axios';
import React, { useState } from 'react';
import { FormControl } from "react-bootstrap";
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { dir_api } from '../handlers/api';
import { notifyAlert } from '../redux/alert/alertSlice';
import alertType from '../redux/alert/alertType';


export default function TokenInputForm(props) {
    const [token, setToken] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onInputChange = (e) => {
        setToken(e.target.value)
    }

    const onSubmitToken = async () => {
        let curToken = ""
        if (cookies.token !== undefined) {
            curToken = cookies.token
        }
        if (token !== "") {
            curToken = token
        }
        if (curToken === "") {
            dispatch(notifyAlert({
                type: alertType.ERROR,
                message: "Please provide a token"
            }))
            return
        }
        await axios.get(dir_api, {
                headers: {
                    "Authorization": `Bearer ${curToken}`,
                },
            })
            .then(res => {
                console.log("Authorized")
                setCookie('token', curToken, {expires: new Date(new Date().getTime()+(24*60*60*1000))})
                navigate('/dir')
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
                } catch (err) {console.log(err)}
                removeCookie('token')
            })
    }

    return (
        <div>
            <div className='token-input'>
                <FormControl placeholder='Enter the token here' onChange={onInputChange} as="textarea" rows={3}></FormControl>
            </div>
            
            <div className='login-button-div' >
                <button className='login-button' onClick={onSubmitToken}>Enter</button>
            </div>
        </div>
    );
}