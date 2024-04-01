import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import PrivateRoute from './authenticate/privateRoute';
import AdminPage from './pages/Admin/AdminPage'
import Menu from './component/Menu/Menu'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense } from 'react';
import CommonToastContainer from './ultis/ToastNoti';

const App = () => {
  const isAuthentication = localStorage.getItem("accesstoken") ? false : true;
  return (
    <Router >
      <Suspense>
      <CommonToastContainer/>
      <Routes>
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/admin" element={<AdminPage />} />
        <Route exact path="/menu" element={<Menu />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      
      

    </Router >
  );
}

export default App;