import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { addUser } from "../MusicLibApi";

function Register() {  
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({ username: "", password: ""});
    const [errorMessage, setErrorMessage] = useState("");

    function handleChange(field, value) {
        setInputs(values => ({ ...values, [field]: value }));
    }

    // Register button clicked
    async function handleSubmit(event) {
        event.preventDefault();
        const newUser = { 
            username: inputs.username, 
            password: inputs.password,
            songLibrary: null
        };

        const result = await addUser(newUser);

        if (result === 201) {
            alert(result + "- Registration successful!");
            navigate("/login");
        }
        else {
            setErrorMessage(result.error);
        }
    }


    return (
        <Container>
            <h2>User Registration</h2>
            <Form onSubmit={handleSubmit} autoComplete="off" className="mb-4">
                <Form.Group className="mb-3 w-25" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text"
                        autoFocus 
                        value={inputs.username} 
                        onChange={(e) => handleChange("username", e.target.value.replace(/\s/g, ""))} />
                </Form.Group>
                <Form.Group className="mb-3 w-25" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" 
                        value={inputs.password}
                        onChange={(e) => handleChange("password", e.target.value.replace(/\s/g, ""))} />
                </Form.Group>
                <Link to="/login" className="d-block mb-3">Already registered? Click here login.</Link>
                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
            
            {errorMessage.length > 0 && <Alert key="warning" variant="warning" className="w-50">{errorMessage}</Alert>}
        
        </Container>
    );    
}

export default Register;