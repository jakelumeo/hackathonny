import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Taskbar from './components/taskbar';
import Home from './pages/Home'; 
import SocialFinance from './pages/SocialFinance';
import MeetLumeo from './pages/MeetLumeo';
import Resources from './pages/Resources';
import JoinNow from './pages/JoinNow';
import About from './pages/AboutUs';
// import './App.css'

function App() {
  return (
    <Router>
      <Taskbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/social-finance" element={<SocialFinance />} />
        <Route path="/meet-lumeo" element={<MeetLumeo />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/join-now" element={<JoinNow />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App
