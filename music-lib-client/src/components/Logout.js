import '../MusicLib.css';
import { Link } from 'react-router-dom';

function Logout() {
    return (
        <>
            <div className="logout-page">
                <h2>Logout</h2>
                <p>You are now logged out.</p>
                <Link to="/login">Return to Login page</Link>
            </div>
        </>
    );
}

export default Logout;