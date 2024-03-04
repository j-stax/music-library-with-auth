import '../MusicLib.css';
import { Link } from 'react-router-dom';

function ErrorJWT() {
    return (
        <div class="redirect-page">
            <h1>401 Error - Invalid JWT!</h1>
            <Link to="/login">Click here to login</Link>
        </div>
    );
}

export default ErrorJWT;