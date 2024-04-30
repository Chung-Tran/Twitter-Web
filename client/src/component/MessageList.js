import React, { useState } from 'react';
import { TbMessagePlus } from "react-icons/tb";
import { AiOutlineSetting } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import axiosClient from '../authenticate/authenticationConfig';
function MessageList({ messages, userId, changeReceiverId }) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleSearch = async (query) => {
    try {
      const response = await axiosClient.get(`/users/search?email=${query}`);
      setSearchResults(response.data.data.QuantityResult.InFo_User);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const debouncedSearch = debounce(handleSearch, 2000);

  const handleChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    debouncedSearch(value);
  };

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
        <input
          placeholder='Search Direct Messages'
          value={searchQuery}
          onChange={handleChange}
        />
      </div>
      <div className='search-results'>
        {searchResults && searchResults.map((user) => (
          <div key={user._id}>
            <span>{user.displayName}</span>
            <button onClick={() => changeUserChat(user._id)}>Select</button>
          </div>
        ))}
      </div>
      {messages && messages.map((item, index) => (
        <div className='message-user-list' key={index} onClick={() => changeUserChat(user[index]._id)}>
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
