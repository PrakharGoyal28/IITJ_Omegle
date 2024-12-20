import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import Authentication from './pages/Authentication.jsx';
import Chat from './pages/chat.jsx';
import VChat from'./pages/videochat.jsx';

function Main() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/Authentication" element={<Authentication />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/videochat" element={<VChat />} />
            </Routes>
        </Router>
    );
}

export default Main;
