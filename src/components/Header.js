import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeAll } from '../redux/uploadFile/uploadFileSlice';

export default function Header(props){
    const [showExit, setShowExit] = useState()
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [cookie, setCookie, removeCookie] = useCookies()
    const onExit = () => {
        dispatch(removeAll())
        removeCookie('token')
        navigate('/')
    }

    useEffect(() => {
        if (window.location.hash === '#/' || window.location.hash === '/' || window.location.hash === '') {
            setShowExit(false)
        } else {
            setShowExit(true)
        }
    }, [window.location.pathname])

    return (
        <div>
            <Navbar bg="dark" className="nav-bar" variant={'dark'} expand="lg" fixed="top">
                <Container>
                    <Navbar.Brand><Link to="/" className='brand-link'>LeonNAS</Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                        </Nav>
                        <Button className='exit-button' onClick={onExit} hidden={!showExit} variant='dark'>Exit</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
      );
}