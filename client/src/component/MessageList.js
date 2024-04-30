import React from 'react';
import { TbMessagePlus } from "react-icons/tb";
import { AiOutlineSetting } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";

function MessageList({ messages, userId,changeReceiverId }) {
  // Tìm thông tin của người dùng cần hiển thị tên
  const user = messages && messages.map(item => {
    // Lấy ra người gửi và người nhận trong lastMessage
    const senderID = item.lastMessage.senderID;
    const receiverID = item.lastMessage.receiverID;

    // Kiểm tra xem người gửi hoặc người nhận có trùng với userId hay không
    if (senderID !== userId) {
      return item.userInfo.find(info => info._id === senderID);
    } else if (receiverID !== userId) {
      return item.userInfo.find(info => info._id === receiverID);
    }
  });
  const changeUserChat = (id) => {
    changeReceiverId(id)
  }

  return (
    <div className='message-list'>
      <div className='message-list-header'>
        <span>Messages</span>
        <ul>
          <li>
            <TbMessagePlus />
          </li>
          <li>
            <AiOutlineSetting />
          </li>
        </ul>
      </div>
      <div className='message-search'>
        <span><CiSearch /></span>
        <input placeholder='Search Direct Messages'></input>
      </div>
      {messages && messages.map((item, index) => (
        <div className='message-user-list' key={index} onClick={()=>changeUserChat(user[index]._id)}>
          <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
          <div className='message-user-single-content'>
            <div className='message-user-single-info'>
              {/* Sử dụng user[index] thay vì item.userInfo[0] */}
              <span>{user[index].displayName}</span>
              <span>{user[index].username}</span>
            </div>
            <span>{item.lastMessage.content}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
