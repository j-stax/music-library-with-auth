import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { loginUser } from "../MusicLibApi";

function Login() {  
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");

    function handleChange(field, value) {
        setErrorMessage("");
        setInputs(values => ({ ...values, [field]: value }));
    }

    // Login button clicked 
    async function handleSubmit(event) {
        event.preventDefault();
        const user = {
            username: inputs.username,
            password: inputs.password
        };

        const result = await loginUser(user);

        if (result.error) {
            setErrorMessage(result.error);
        }
        else {
            navigate("/home");
        }
    }

    return (
        <Container>
            <h2>User Login</h2>
            <Form onSubmit={handleSubmit} autoComplete="off" className="mb-4">
                <Form.Group className="mb-3 w-25" controlId="username">
                    <Form.Label >Username</Form.Label>
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
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Login
                </Button>
                <Link to="/register" className="ml-3">Click here to register.</Link>
            </Form>

            {errorMessage.length > 0 && <Alert key="warning" variant="warning" className="w-50">{errorMessage}</Alert>}

        </Container>
    );    
}

export default Login;