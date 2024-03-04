import '../MusicLib.css';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import { useNavigate, Link } from 'react-router-dom';
import { getSongs, getSongsByFilter, logout } from '../MusicLibApi';

function Home() {
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [inputs, setInputs] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    function handleChange(e) {
        setErrorMessage("");
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage("");
        setIsLoading(true);
        const form = event.target;
        const selection = form.formSelect.value;
        const searchVal = form.formInput.value.trim().toLowerCase();

        if (selection !== "choose" && searchVal) {
            const result = await getSongsByFilter(selection, searchVal);
            setIsLoading(false);

            if (result.error) {        
                setErrorMessage(result.error);
                setSongs([]);
            }
            else {
                setSongs(result);
            }
        }
        else if (selection === "choose" && !searchVal) {
            const result = await getSongs();
            setIsLoading(false);

            if (result.error) {
                setErrorMessage(result.error);
            }
            else {
                setSongs(result);
            }       
        }
        else {
            setIsLoading(false);
            setErrorMessage("Please complete both selection and input field, or leave blank for all songs.");
        }

        // Clear input values
        setInputs(prevState => ({...prevState, formSelect: "", formInput: ""}));
    }

    function handleLogout() {
        logout();
        navigate("/logout");
    }

    function capitalizeArrayElem(arr) {
        arr.forEach(function(element, index) {
            arr[index] = titleCase(element);
        })
        return arr.join(", ");
    }

    function titleCase(str) {
        let strSplitArray = str.split(" ");
        strSplitArray.forEach(function(word, index) {
            strSplitArray[index] = word.charAt(0).toUpperCase() + word.substr(1);
        })
        return strSplitArray.join(" ");
    }

    useEffect( () => {
        async function getAllSongs() {
            const result = await getSongs();
            setIsLoading(false);

            if (result.error) {
                if (result.error === "Invalid JWT") {
                    navigate("/error/invalid-token");
                }
                else {
                    alert(result.error);
                }
            }
            else {
                setSongs(result);
            }
            
        }

        getAllSongs();
    }, []);


    return (
        <>
            <Row>
                <Col>
                    <h1>My Music Library</h1>
                </Col>
                <Col>
                    <LinkContainer to="/add">
                        <Button className="float-end">
                            Add New Song
                        </Button>
                    </LinkContainer>
                </Col>
                <Button type="button" className="p-1 m-1" onClick={handleLogout}>
                    <ArrowRightSquare className="align-middle" size={20} /> Logout
                </Button>
            </Row>
            <Form onSubmit={handleSubmit} className="mt-4 mb-4 d-flex">
                <Form.Select 
                    className="mr-1" 
                    controlId="formSelect"
                    name="formSelect"
                    value={inputs.formSelect}
                    onChange={handleChange}
                >
                    <option value="choose">Choose</option>
                    <option value="artist">Artist</option>
                    <option value="genre">Genre</option>
                </Form.Select>
                <Form.Control 
                    className="w-25 mr-1"
                    controlId="formInput"
                    type="text" 
                    name="formInput" 
                    value={inputs.formInput} 
                    onChange={handleChange} />
                <Button type="submit">
                    Search
                </Button>
            </Form>

            { errorMessage.length > 0  && <p id="errorMsg" >{errorMessage}</p> }

            <br />
            {isLoading
                ? (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : (
                    <ol>
                        {songs.map(song => 
                            <li key={song.id}>
                                <Link to={`/edit/${song._id}`} >
                                    {capitalizeArrayElem(song.artist)} - {titleCase(song.title)}
                                </Link>
                            </li>)}
                    </ol>
                )
            }
        </>
    );
}

export default Home;