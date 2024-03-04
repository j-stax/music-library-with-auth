import { Form, Button, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Alert from 'react-bootstrap/Alert';
import { addSong } from '../MusicLibApi';

function AddSong() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    function handleChange(name, value) {
        setErrorMessage("");
        setInputs(values => ({ ...values, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (inputs.title && inputs.artist && inputs.genre) {
            const song = {
                title: inputs.title.trim().toLowerCase(),
                artist: inputs.artist.trim().replace(/,\s/g, ",").toLowerCase().split(","),
                releaseYear: inputs.releaseYear,
                genre: inputs.genre.trim().replace(/,\s/g, ",").toLowerCase().split(",")
            };

            const result = await addSong(song);

            if (result.error) {
                setErrorMessage(result.error);
            }
            else {
                goBack();
            }
        }
        else {
            setErrorMessage("Title, Artist, and Genre fields must be completed!");
        }
    }

    function goBack() {
        navigate("/home");
    }

    return (
        <>
            <h1 className="ml-4 mb-4">Add Song</h1>
            <Form onSubmit={handleSubmit} className="mb-4">
                <Form.Group as={Row} className="mb-3" controlId="title">
                    <Form.Label column sm="2">Title:</Form.Label>
                    <Col sm="4">
                        <Form.Control type="text"
                            autoFocus
                            value={inputs.title}
                            onChange={(e) => handleChange("title", e.target.value)} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="artist">
                    <Form.Label column sm="2">Artist:</Form.Label>
                    <Col sm="4">
                        <Form.Control type="text"
                            value={inputs.artist}
                            onChange={(e) => handleChange("artist", e.target.value)} />
                        <Form.Text className="text-muted">
                            Separate with comma if multiple artists apply.
                        </Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="releaseYear">
                    <Form.Label column sm="2">Release Year:</Form.Label>
                    <Col sm="4">
                        <Form.Control type="number"
                            value={inputs.releaseYear}
                            onChange={(e) => handleChange("releaseYear", e.target.value)} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="genre">
                    <Form.Label column sm="2">Genre:</Form.Label>
                    <Col sm="4">
                        <Form.Control type="text"
                            value={inputs.genre}
                            onChange={(e) => handleChange("genre", e.target.value)} />
                        <Form.Text className="text-muted">
                            Separate with comma if multiple genres apply.
                        </Form.Text>
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit" className="mr-2">
                    Add
                </Button>
                <Button variant="secondary" type="button" onClick={goBack}>
                    Cancel
                </Button>
            </Form>
            
            {errorMessage.length > 0 && <Alert key="warning" variant="warning" className="w-50">{errorMessage}</Alert>}
        </>
    );
}

export default AddSong;
