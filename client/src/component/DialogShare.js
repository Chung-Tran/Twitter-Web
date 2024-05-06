//import React, { useEffect, useState }from 'react'
import React, { useState, useEffect } from 'react';
import { useRef } from 'react';

import { AiOutlineSetting } from "react-icons/ai";
import { CiImageOn } from "react-icons/ci";
import { AiOutlineFileGif } from "react-icons/ai";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axiosClient from '../authenticate/authenticationConfig';
import { toast } from 'react-toastify';
import Post from './post/post';


function DialogShare({sweet, onCloseDialog}) {
    const navigate = useNavigate();
    const handleReturnPort = () => {
        navigate("/")
    }

    const [showDialog, setShowDialog] = useState(true);
    const [postSweetContent, setPostSweetContent] = useState();
    const [isCreateShare, setIsCreateShare] = useState(false);
    const [isShare, setIsShare] = useState();
    const textareaRef = useRef(null);

    useEffect(() => {
    if (showDialog && textareaRef.current) {
      textareaRef.current.focus();
    }
    }, [showDialog]);
  
    const handleCloseDialog = () => {
        setShowDialog(false); 
        onCloseDialog(false);
    };

    const checkIsShare = async () => {
        try {
            if (sweet && sweet._id) {
                const response = await axiosClient.get(`/sweet/checkSweetOrShare?SweetID=${sweet._id}`);
                if(response.data.isSuccess){
                    if(response.data.data.State){
                        setIsShare(false);
                    }else {
                        setIsShare(true);
                    }
                }
            }
        } catch (error) {
          toast.error(error.response?.data.errorMessage ?? "Unexpected error");
        }
    };

    useEffect(() => {
        checkIsShare();
        
    }, [sweet._id]); 

    const handleCreateShare = async () => {
        try {
            const formData = new FormData();
            formData.append('content', postSweetContent);
            if(!isShare){
                const response = await axiosClient.post(`/share/createShare/${sweet._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.data.isSuccess) {
                    // setSweetList(response.data.data.InFo_Sweet);
                    setPostSweetContent('');
                    toast.success("Tạo bài viết thành công!");
                    setIsCreateShare(true);
                }else toast.error(response.errorMessage); 
            }else{
                const response = await axiosClient.post(`/share/createShare/${sweet.SweetID}`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.data.isSuccess) {
                    // setSweetList(response.data.data.InFo_Sweet);
                    setPostSweetContent('');
                    toast.success("Tạo bài viết thành công!");
                    setIsCreateShare(true);
                }else toast.error(response.errorMessage);
            }
        } catch (error) {
          console.error("Error posting content:", error);
          toast.error("Lỗi khi tạo mới bài viết");
        }
        handleCloseDialog();
    };


    return (
    <div className='dialogShare-container'> 
        {showDialog ? (
            <div className="overlay">
                <div className="dialog">
                    <div className="dialog-header">
                        {isShare ? (
                            <h2>{sweet.UserName_Origin.username === '' ? `Share bài viết của ${sweet.UserName_Origin.displayName}` : `Share bài viết của ${sweet.UserName_Origin.username}`}</h2>
                        ) : (
                            <h2>{sweet.UserName.username === '' ? `Share bài viết của ${sweet.UserName.displayName}` : `Share bài viết của ${sweet.UserName.username}`}</h2>
                        )}
                        <button className="close-button" onClick={() => handleCloseDialog()}>&times;</button>
                    </div>

                    <div className='post-create-box-share'>
                        <div className='input-box-avatar'>
                            <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                        </div>
                        <div className='create-box-input'>
                            <div className='input-box-text-share'>
                                <textarea
                                    ref={textareaRef}
                                    name="postSweetContent"
                                    value={postSweetContent}
                                    onChange={(e) => setPostSweetContent(e.target.value)}
                                    placeholder='What do you think about this status?!'
                                    rows={2}
                                    cols={40}
                                />
                            </div>

                            <div className='box-icon'>
                                <div className='icon-list'>
                                    <nav>
                                        <ul>
                                            <li></li>
                                            <li><AiOutlineFileGif /></li>
                                            <li><AiOutlineUnorderedList /></li>
                                            <li><BsEmojiSmile /></li>
                                            <li><SlCalender /></li>
                                            <li><CiLocationOn /></li>
                                        </ul>
                                    </nav>
                                </div>
                                <button onClick={handleCreateShare}>Post</button>
                            </div>

                        </div>
                    </div>

                    <div>
                        {isShare ? (
                            <div className='post-share'> 
                                <div className='user-info'>
                                    <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                                    <div className='info-content'>
                                        <div className='user-info-name'>
                                            <span>{sweet.UserName_Origin.displayName}</span>
                                            <span>{sweet.UserName_Origin.username}</span>
                                        </div>
                                        <span className='post-createdAt'>{sweet.Duration_Origin}</span>
                                    </div>
                                </div>
        
                                <div className='single-post-content'> 
                                    <div className='text-content'>
                                        <span >{sweet.Content_Origin}</span>
                                    </div>
        
                                    <div className='image-content'>
                                    { sweet.Image_Origin && sweet.Image_Origin.map((item, index) => (
                                        <img src={item} />
                                        ))
                                    }
                                    </div>
                                </div>
                            </div>  
                        ):(
                            <div className='post-share'> 
                                <div className='user-info'>
                                    <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                                    <div className='info-content'>
                                        <div className='user-info-name'>
                                            <span>{sweet.UserName.displayName}</span>
                                            <span>{sweet.UserName.username}</span>
                                        </div>
                                        <span className='post-createdAt'>{sweet.Duration}</span>
                                    </div>
                                </div>
        
                                <div className='single-post-content'> 
                                    <div className='text-content'>
                                        <span >{sweet.Content}</span>
                                    </div>
        
                                    <div className='image-content'>
                                    { sweet.Image && sweet.Image.map((item, index) => (
                                        <img src={item} />
                                        ))
                                    }
                                    </div>
                                </div>
                            </div>  
                        )}
                    </div>

                    

                </div>
            </div>
        ): (null)}
     <div>{isCreateShare && <Post isCreateShare = {isCreateShare}/>}</div>
    </div>
    )
}

export default DialogShare
