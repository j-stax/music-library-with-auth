import { Form, Button, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { getSong, editSong, deleteSong } from '../MusicLibApi';

function EditSong() {
    const { songId } = useParams();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    function handleChange(name, value) {
        setInputs(values => ({ ...values, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        
        if (inputs.title && inputs.artist && inputs.genre) {
            const songPart = {
                title: inputs.title.trim().toLowerCase(),
                artist: inputs.artist.trim().replace(/,\s/g, ",").toLowerCase().split(","),
                releaseYear: inputs.releaseYear,
                genre: inputs.genre.trim().replace(/,\s/g, ",").toLowerCase().split(",")
            }

            const result = await editSong(songId, songPart);

            if (result.error) {
                setErrorMessage(`Error - ${result.error}`);
            }
            else {
                goBack();
            }
        }
        else {
            setErrorMessage("Title, artist, and genre are required.");
        }
    }

    async function handleDelete() {
        const result = await deleteSong(songId);

        if (result.error) {
            setErrorMessage(`Error - ${result.error}`);
        }
        else {
            goBack();
        }
    }

    function capitalizeArrayElem(arr) {
        let capitalizedArr = arr.map((word) => word.charAt(0).toUpperCase() + word.substr(1));
        return capitalizedArr.join(", ");
     }

        function titleCase(str) {
            let strSplitArray = str.split(" ");
            strSplitArray.forEach(function(word, index) {
                strSplitArray[index] = word.charAt(0).toUpperCase() + word.substr(1);
            })
            return strSplitArray.join(" ");
        }

    function goBack() {
        navigate("/home");
    }

    useEffect( () =>  {
        async function loadSong() {
            const result = await getSong(songId);

            if (result.error) {
                if (result.error === "Invalid JWT") {
                    navigate("/error/invalid-token");
                }
                else {
                    setErrorMessage(result.error);
                }
            }
            else {
                setInputs({
                    title: titleCase(result.title),
                    artist: titleCase(capitalizeArrayElem(result.artist)),
                    releaseYear: result.releaseYear,
                    genre: capitalizeArrayElem(result.genre)
                });
            }
        }

        loadSong();
    }, [songId]);

    return (
        <>
            <Row>
                <Col>
                    <h1 className="ml-4 mb-4">Edit Song</h1>
                </Col>
                <Col>
                    <Button variant="danger" type="button" onClick={handleDelete}>
                        Delete
                    </Button>
                </Col>
            </Row>
            <Form onSubmit={handleSubmit} className="mb-4">
                <Form.Group as={Row} className="mb-3" controlId="title">
                    <Form.Label column sm="2">Title:</Form.Label>
                    <Col sm="4">
                        <Form.Control type="text"
                            name="title"
                            value={inputs.title} 
                            onChange={ (e) => handleChange("title", e.target.value) } />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="artist">
                    <Form.Label column sm="2">Artist:</Form.Label>
                    <Col sm="4">
                        <Form.Control type="text"
                            name="artist"
                            value={inputs.artist} 
                            onChange={ (e) => handleChange("artist", e.target.value) } />
                        <Form.Text className="text-muted">
                                Separate with comma if multiple artists apply.
                        </Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="releaseYear">
                    <Form.Label column sm="2">Release Year:</Form.Label>
                    <Col sm="4">
                        <Form.Control type="number"
                            name="releaseYear"
                            value={inputs.releaseYear} 
                            onChange={ (e) => handleChange("releaseYear", e.target.value) } />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="genre">
                    <Form.Label column sm="2">Genre:</Form.Label>
                    <Col sm="4">
                        <Form.Control type="text"
                            name="genre"
                            value={inputs.genre} 
                            onChange={ (e) => handleChange("genre", e.target.value) } />
                        <Form.Text className="text-muted">
                            Separate with comma if multiple genres apply.
                        </Form.Text>
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit" className="mr-2">Save</Button>
                <Button variant="secondary" type="button" onClick={goBack}>Cancel</Button>
            </Form>

            {errorMessage.length > 0 && <Alert key="warning" variant="warning" className="w-50">{errorMessage}</Alert>}
        </>
    );
}

export default EditSong;