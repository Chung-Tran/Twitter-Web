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
import Layout from './layout';
import MessageLayout from './messageLayout';
import MessagePage from './pages/MessagePage';

const App = () => {
  const isAuthentication = localStorage.getItem("accesstoken") ? true : false;
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <CommonToastContainer />
        <Routes>
          <Route exact path="/login" element={<LoginPage />} />
          <Route path="/messages" element={<MessageLayout />}>
            <Route index element={<MessagePage />} />
          </Route>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/status/:id" element={<SweetDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;