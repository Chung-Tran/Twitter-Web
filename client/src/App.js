import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, useEffect } from 'react';
import CommonToastContainer from './ultis/ToastNoti';
import HomePage from './pages/HomePage';
import SinglePost from './component/SinglePost';
import SweetDetail from './pages/SweetDetail';
import Layout from './layout';
import MessageLayout from './messageLayout';
import MessagePage from './pages/MessagePage';
import NotificationPage from './pages/NotificationPage';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
const client = W3CWebSocket('ws://localhost:8080');
const App = () => {
  const token = localStorage.getItem("token");
  const userId = token && jwtDecode(token).userId;

  useEffect(() => {
    // Lắng nghe tin nhắn từ server
    client.onmessage = function (event) {
      const receivedMessage = JSON.parse(event.data);
      console.log(userId,receivedMessage)
      if (receivedMessage?.userId == userId) {
        if (receivedMessage && receivedMessage?.type == "Notify") {
          toast.info(receivedMessage.content)
        }
      }

    };
    // return () => {
    //   client.close(); // Đóng kết nối khi component unmount
    // };
  }, []);
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
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/status/:id" element={<SweetDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;