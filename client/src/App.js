import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route exact path="/login" element={<LoginPage/>}/>
          <Route path="*" element={<NotFound/>}/> 
        </Routes>
    </Router>
  );
}

export default App;