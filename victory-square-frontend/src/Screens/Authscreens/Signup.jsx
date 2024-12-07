import { useState } from "react";
import "./Authscreens.scss"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Spinner } from "react-bootstrap";

import {toast} from 'react-toastify'
import axios from "axios";
import { AppContext } from '../../Context/AppContext';
import { useContext } from 'react';
import { useNavigate } from "react-router";

import validate from "../../validations/authValidation";

const signupRequest = (formData, setToken, setUser, navigate, setWaiting)=>{
    let data = JSON.stringify(formData);
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://192.168.49.2:30007/authentication-service/register',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };
    
    setWaiting(true)
    axios.request(config)
    .then((response) => {
        let token = response.data.token;
        if(token === null){
            throw new Error("Some problem occurred!");
        }
        let user = response.data.user;
        console.log(user);
        
        setToken(token)
        setUser(user)
        navigate("/")
    })
    .catch((error) => {
        toast.error(error.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }).finally(()=>{
        setWaiting(false)
    });
}

const Signup = ()=>{
    const [formData, setFormData] = useState({
        email : '', name : '', password : ''
    });
    const [errors, setErrors] = useState({});
    const [waiting, setWaiting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const {setToken, setUser} = useContext(AppContext)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate(formData, setErrors)) {
            signupRequest(formData, setToken, setUser, navigate, setWaiting)
        } else {
            toast.error("Validation failed", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    };


    return <div className="authscreen d-flex flex-column justify-content-center align-items-center">
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type = "email"
                    placeholder = "Enter email"
                    onChange = {handleChange}
                    isInvalid ={ !!errors.email}
                    name = "email"
                />
                <Form.Control.Feedback type="invalid">
                    {errors.email}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type = "text"
                    placeholder = "Enter your name"
                    onChange ={ handleChange}
                    isInvalid = {!!errors.name}
                    name = "name"
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type = "password"
                    placeholder = "Password"
                    onChange = {handleChange}
                    isInvalid = {!!errors.password}
                    name = "password"
                />
                <Form.Control.Feedback type="invalid">
                    {errors.password}
                </Form.Control.Feedback>
            </Form.Group>
            
            {
                waiting ? 
                <Spinner variant="warning"/> : 
                <Button variant="warning" type="submit">
                    Sign up
                </Button>
            }
            
        </Form>
        <Button variant="light" href="/login">
            Log in instead
        </Button>
    </div>
}

export default Signup