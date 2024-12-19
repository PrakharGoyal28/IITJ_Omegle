import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import Authentication from './pages/Authentication.jsx';

function Main() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/Authentication" element={<Authentication />} />
            </Routes>
        </Router>
    );
}

export default Main;
