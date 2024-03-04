import '../MusicLib.css';
import { logout } from '../MusicLibApi';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function Logout() {

    useEffect( () => {
        logout();
    }, []);

    return (
        <div className="redirect-page">
            <h2>Logout</h2>
            <p>You are now logged out.</p>
            <Link to="/login">Return to Login page</Link>
        </div>
    );
}

export default Logout;