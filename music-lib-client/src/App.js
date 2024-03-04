import { Route, Routes, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Home from './components/Home';
import AddSong from './components/AddSong'; 
import EditSong from './components/EditSong';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';

function App() {
  return (
    <Container className="mt-3">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add" element={<AddSong />} />
        <Route path="/edit/:songId" element={<EditSong />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Container>  
  );
}

export default App;
