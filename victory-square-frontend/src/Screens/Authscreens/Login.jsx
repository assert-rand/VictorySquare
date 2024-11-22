import { useState } from "react";
import "./Authscreens.scss"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Spinner } from "react-bootstrap";

const Login = ()=>{
    const [formData, setFormData] = useState({
        email : '', password : ''
    });
    const [errors, setErrors] = useState({});
    const [waiting, setWaiting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form Submitted:', formData);
            setSubmitted(true);
        } else {
            setSubmitted(false);
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
                    Log in 
                </Button>
            }
            
        </Form>
        <Button variant="light" href="/signup">
            Sign up instead
        </Button>
    </div>
}

export default Login