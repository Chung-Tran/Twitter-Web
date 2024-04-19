// Menu.js
import React, { useEffect, useState } from 'react';
import { AiOutlineSetting } from "react-icons/ai";
import { CiImageOn } from "react-icons/ci";
import { AiOutlineFileGif } from "react-icons/ai";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import { CiLocationOn } from "react-icons/ci";
import axiosClient from '../../authenticate/authenticationConfig';
import SinglePost from '../SinglePost';
import { toast } from 'react-toastify';

function Post() {
  const [sweetList, setSweetList] = useState([]);
  let limit = 10;
  let skip = 0;
  useEffect(() => {
      const fetchData = async () => {
        const response = await axiosClient.get(`/sweet/getManySweet?limit=${limit}&skip=${skip}`);
          if (response.data.isSuccess) {
              setSweetList(response.data.data.InFo_Sweet)
          } else {
              toast.error(response.errorMessage);
          }
      };
      fetchData();
  }, [limit,skip]);
  return (
    <div className='homepage-post'>
      <div className='post-type-sweet'>
        <span>For you</span>
        <span>Following</span>
        <AiOutlineSetting width={20} color='white' fontSize={23} style={{ marginRight: '1px', marginTop: '10px', right: '0' }} />
      </div>
      <div className='post-create-box'>
        <div className='input-box-avatar'>
          <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
        </div>
        <div className='create-box-input'>
          <div className='input-box-text'>
            <textarea
              name=""
              placeholder='What is happening?!'
              rows={4}
              cols={40}
            />
          </div>
          <div className='box-icon'>
            <div className='icon-list'>
              <nav>
                <ul>
                  <li><CiImageOn /></li>
                  <li><AiOutlineFileGif /></li>
                  <li><AiOutlineUnorderedList /></li>
                  <li><BsEmojiSmile /></li>
                  <li><SlCalender /></li>
                  <li><CiLocationOn /></li>
                </ul>
              </nav>
            </div>
            <button>Post</button>
          </div>
        </div>
      </div>
      <div>
        {sweetList && sweetList.map((item,index) => (
          <div key={index} className='post-content'>
            <SinglePost sweetData={item} />
        </div>
        ))}
      </div>
    </div>
  );
};

export default Post;