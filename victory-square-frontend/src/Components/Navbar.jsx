import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';

import './Navbar.scss'

import { AppContext } from '../Context/AppContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router';

const NavbarV = ()=>{

    const {appState, setUser} = useContext(AppContext);
    const handleLogout = ()=>{
        setUser(null)
    }
    const navigate = useNavigate()

    return (
    <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container>
            <Navbar.Brand onClick={()=>{
                navigate("/")
            }}>
                <img
                src="/src/assets/icons/white-bg-chess.png"
                width="30"
                height="30"
                className="d-inline-block align-top navicon"
                />
                VictorySquare
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="m-2">
                    {
                        appState.user === null ? 
                        <Nav.Link href="/login">Log In</Nav.Link> : 
                        <Button variant='danger' onClick={handleLogout}>Log out</Button>
                    }

                    {   
                        appState.user === null ? 
                        null : 
                        <Nav.Link onClick={()=>{
                            navigate("/notifications")
                        }}>Notifications</Nav.Link>
                    }   
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
  );
}

export default NavbarV;