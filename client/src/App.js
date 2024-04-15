import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import Menu from './component/Menu/Menu'
import 'react-toastify/dist/ReactToastify.css';
import { Suspense } from 'react';
import CommonToastContainer from './ultis/ToastNoti';
import HomePage from './pages/HomePage';
import SinglePost from './component/SinglePost';
import SweetDetail from './pages/SweetDetail';

const App = () => {
  const isAuthentication = localStorage.getItem("accesstoken") ? false : true;
  return (
    <Router >
      <Suspense>
      <CommonToastContainer/>
      <Routes>
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/menu" element={<Menu />} />
        <Route exact path="/status/:id" element={<SweetDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </Router >
  );
}

export default App;