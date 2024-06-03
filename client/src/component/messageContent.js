import React, { useEffect, useRef, useState } from 'react'
import { IoMdInformationCircleOutline } from "react-icons/io";
import { jwtDecode } from "jwt-decode";
import { CiImageOn } from "react-icons/ci";
import { AiOutlineFileGif } from "react-icons/ai";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { AiOutlineSend } from "react-icons/ai";
import axiosClient from '../authenticate/authenticationConfig';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
const client = new W3CWebSocket('ws://localhost:8080');
function MessageContent({ receiverId, resetData }) {
  const navigate = useNavigate();
  const { id } = useParams()
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [userId, setUserId] = useState(null);
  const [messageSendContent, setMessageSendContent] = useState('');
  const messageDetailRef = useRef(null);
  useEffect(() => {
    //Lấy thông tin người dùng từ local =>set userid
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login')
    }
    const userDecoded = jwtDecode(token);
    if (userDecoded) {
      setUserId(userDecoded.userId)
    }

    // Gọi API để lấy thông tin người nhận
    const fetchData = async () => {
      // await axiosClient.get(`users/${receiverId}`)
      await axiosClient.get(`users/${id}`)
        .then(response => {
          const userData = response.data.data;
          setReceiver(userData);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });

      // Gọi API để lấy toàn bộ tin nhắn

      // await axiosClient.get(`chat/${receiverId}`)
      await axiosClient.get(`chat/${id}`)
        .then(response => {
          const data = response.data.data;
          setMessages(data);
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
        });
    }
    receiverId && fetchData()
  }, [receiverId]);
  useEffect(() => {
    // Lắng nghe tin nhắn từ server
    client.onmessage = function (event) {
      const receivedMessage = JSON.parse(event.data);
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
    };
    // return () => {
    //   client.close(); // Đóng kết nối khi component unmount
    // };
  }, []);

  const scrollToBottom = () => {
    messageDetailRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    resetData()
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (messageSendContent.trim() !== '') {
      const message = {
        content: messageSendContent,
        // senderId: userId,
        senderId: userId,
        receiverId: id,
        type: "chat"
      };
      const messageString = JSON.stringify(message);
      await client.send(messageString);
      setMessageSendContent(''); // Xóa nội dung tin nhắn sau khi gửi
    }
  };
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const addEmoji = (emoji) => {
    setMessageSendContent(messageSendContent + emoji.native);
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && messageSendContent.trim() !== '') {
        sendMessage();
    }
};
  return messages && (
    <div className='message-content'>
      <div style={{ minHeight: '92%', overflow: 'auto' }}>
        <div className='message-info'>
          <div className='message-content-header'>
            <span>{receiver && receiver.displayName}</span>
            <span>
              <IoMdInformationCircleOutline />
            </span>
          </div>
          <div className='message-content-userinfo'>
            <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
            <span id='message-userinfo-username'>{receiver && receiver.displayName}</span>
            <span id='message-userinfo-displayname'>{receiver && receiver.userName}</span>
            <span id='message-userinfo-jointime'>{receiver && "Joined July 2020 - 0 Followers"}</span>
          </div>
        </div>
        <div className='message-detail' >
          {/* Hiển thị tin nhắn */}
          {messages.map((message) => (
            <div
              key={message._id}
              className={`message ${message.senderID === /*receiverId*/id ? 'message-received' : 'message-sent'}`}
            >
              <span>{message.content}</span>
            </div>
          ))}
        </div>
        <div ref={messageDetailRef} />
      </div>

      <div className='handle-sent-message'>
        <ul>
          <li>
            {/* Hiển thị icon CiImageOn */}
            <label htmlFor="fileInput" style={{ display: 'flex', cursor: 'pointer', fontSize: '25px' }}>
              <CiImageOn />
              {/* Ẩn input file */}
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                accept="image/*"
              //onChange={handleFileChange}
              />
            </label>
          </li>
          <li><MdOutlineEmojiEmotions onClick={toggleEmojiPicker} /></li>
          <li><AiOutlineUnorderedList /></li>
          {showEmojiPicker && (
            <div style={{ position: 'absolute', bottom: '60px', left: '0px' }}>
              <Picker
                onEmojiSelect={addEmoji}
                data={data}
                style={{
                  position: "absolute",
                  marginTop: "465px",
                  marginLeft: -40,
                  maxWidth: "320px",
                  borderRadius: "20px",
                }}
                theme="dark"
              />
            </div>
          )}
        </ul>
        <div className='handle-send' style={{cursor:'default'}}>
          <input
            placeholder='Start a new message'
            type='text'
            onChange={(e) => setMessageSendContent(e.target.value)
            }
            value={messageSendContent}
            onKeyDown={handleKeyPress}
          />
          <button onClick={() => sendMessage()} disabled={messageSendContent.trim() === ''}><AiOutlineSend /></button>
        </div>
      </div>
    </div>
  )
}

export default MessageContent
