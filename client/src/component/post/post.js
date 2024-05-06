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
import DialogShare from '../DialogShare';

function Post({isCreateShare}) {
  const [selectedTab, setSelectedTab] = useState('For You');
  const [isCreateShareSuccess, setIsCreateShareSuccess] = useState(false);
  const [sweetList, setSweetList] = useState([]);
  const [postSweetContent, setPostSweetContent] = useState();
  const [selectedFile, setSelectedFile] = useState([]);
  // const [previewImage, setPreviewImage] = useState(null); 
  let limit = 40;
  let skip = 0;
  const fetchData = async () => {
    try {
      let response;
      if (selectedTab === 'For You') {
        response = await axiosClient.get(`/sweet/getManySweetAndShareForYou?limit=${limit}&skip=${skip}`);
        if (response.data.isSuccess) {
          setSweetList(response.data.data.InFo_Sweet)
        } else {
          toast.error(response.errorMessage);
        }
      } else if (selectedTab === 'Following') {
        response = await axiosClient.get(`/sweet/getManySweetAndShareFollowing?limit=${limit}&skip=${skip}`);
        if (response.data.isSuccess) {
          setSweetList(response.data.data.InFo_Sweet)
        } else {
          toast.error(response.errorMessage);
        }
      }
      
    } catch (error) {
      console.error("Error occurred while fetching sweet data:", error);
    }
  };

  useEffect(() => {
    setSelectedTab('For You');
  }, []);

  useEffect(() => {
    setIsCreateShareSuccess(isCreateShare);
  }, [isCreateShare]);

  useEffect(() => {
    fetchData();
  }, [selectedTab, limit, skip, isCreateShareSuccess]);

  useEffect(() => {
    if(isCreateShareSuccess){
      fetchData();
    }
  }, [isCreateShare]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    console.log(selectedTab);
  };

  /*const fetchData = async () => {
   const response = await axiosClient.get(`/sweet/getManySweet?limit=${limit}&skip=${skip}`);
    //const response = await axiosClient.get(` /sweet/getManySweetAndShareForYou`);
    if (response.data.isSuccess) {
      setSweetList(response.data.data.InFo_Sweet)
    } else {
      toast.error(response.errorMessage);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [limit, skip]);*/


  const postContentHandle = async () => {
    try {
      const formData = new FormData();
      formData.append('content', postSweetContent);
      selectedFile && formData.append('image', selectedFile);
      const response = await axiosClient.post('/sweet/createSweet', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.isSuccess) {
        setSweetList(response.data.data.InFo_Sweet);
        setPostSweetContent('');
        toast.success("Tạo bài viết thành công!");
        fetchData();
      } else {
        toast.error(response.errorMessage);
      }
    } catch (error) {
      console.error("Error posting content:", error);
      toast.error("Lỗi khi tạo mới bài viết");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("file: ", file);
    
    // Create a preview image URL for the selected file
    // const reader = new FileReader();
    // reader.onload = () => {
    //   setPreviewImage(reader.result);
    // };
    // reader.readAsDataURL(file);
  };

  

  return (
    <div className='homepage-post'>
      {sweetList ? (
        <div>
          <div className='post-type-sweet'>
        <span className={selectedTab === 'For You' ? 'selected-tab' : ''} onClick={() => handleTabClick('For You')}>For you</span>
        <span className={selectedTab === 'Following' ? 'selected-tab' : ''} onClick={() => handleTabClick('Following')}>Following</span>
        
        <AiOutlineSetting width={20} color='white' fontSize={23} style={{ marginRight: '1px', marginTop: '10px', right: '0' }} />
      </div>
      <div className='post-create-box'>
        <div className='input-box-avatar'>
          <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
        </div>
        <div className='create-box-input'>
          <div className='input-box-text'>
            <textarea
              name="postSweetContent"
              value={postSweetContent}
              onChange={(e) => setPostSweetContent(e.target.value)}
              placeholder='What is happening?!'
              rows={4}
              cols={40}
            />
          </div>
          <div className='box-icon'>
            <div className='icon-list'>
              <nav>
                <ul>
                    <li>
                      {/* Hiển thị icon CiImageOn */}
                      <label htmlFor="fileInput" style={{display:'flex', alignItems:'center',justifyContent:'center' ,cursor:'pointer',fontSize:'23px'}}>
                        <CiImageOn />
                        {/* Ẩn input file */}
                        <input
                          type="file"
                          id="fileInput"
                        style={{ display: "none" }}
                        accept="image/*" 
                          onChange={handleFileChange}
                        />
                      </label>
                    </li>
                    <li><AiOutlineFileGif /></li>
                    <li><AiOutlineUnorderedList /></li>
                    <li><BsEmojiSmile /></li>
                    <li><SlCalender /></li>
                    <li><CiLocationOn /></li>
                  </ul>
              </nav>
            </div>
            <button onClick={postContentHandle}>Post</button>
          </div>
        </div>
              {/* Preview image
        {previewImage && (
        <div className="preview-image">
          <img src={previewImage} alt="Preview" />
        </div>
      )} */}
      </div>

      
      {/* <div>
        {sweetList && sweetList.map((item, index) => (
          <div key={index} className='post-content'>
            <SinglePost sweetData={item} selectedTab={selectedTab} resetData={fetchData}/>
          </div>
        ))}
      </div> */}

      {sweetList && sweetList.map((item, index) => (
    <div key={index} className='post-content'>
        <SinglePost sweetData={item} selectedTab={selectedTab} resetData={fetchData} />
    </div>
))}
        </div>
      ):(null)}

    </div>
  );
};

export default Post;