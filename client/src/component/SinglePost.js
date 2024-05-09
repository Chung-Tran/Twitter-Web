//import React, { useEffect, useState }from 'react'
import React, { useState, useEffect } from 'react';

import { CiImageOn } from "react-icons/ci";
import { AiOutlineFileGif } from "react-icons/ai";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import { CiLocationOn } from "react-icons/ci";

import { FaRegComment } from "react-icons/fa";
import { GiRapidshareArrow } from "react-icons/gi";
import { AiOutlineHeart } from "react-icons/ai";
import { BsReverseListColumnsReverse } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axiosClient from '../authenticate/authenticationConfig';
import { toast } from 'react-toastify';
import  Dialog  from '../component/Dialog'
import DialogShare from './DialogShare';
import { FaEllipsisV } from "react-icons/fa";
import DialogHistorySweet from './DialogHistorySweet';


function SinglePost({ sweetData, selectedTab, resetData }) {
    const navigate = useNavigate();
    const handleGetSweetDetail = (_id) => {
        navigate(`/status/${_id}`, { state: { source: 'sweetDetail' } })
    }

    const handleGetListLike = (_id) => {
        navigate(`/listLike/${_id}`, { state: { source: 'getListLike' } })
    }
    const userId = JSON.parse(localStorage.getItem("twitter-user"))?._id;

    const [checkIsLiked, setCheckIsLiked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [quantityLike, setQuantityLike] = useState(sweetData.QuantityLike); 
    const [quantityShare, setQuantityShare] = useState(sweetData.QuantityShare); 
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogCreateShare, setShowDialogCreateShare] = useState(false);
    const [getList, setGetList] = useState();
    const [isShare, setIsShare] = useState(false)
    const [isOption, setIsOption] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState([]);
    const [updatedSweet, setUpdatedSweet] = useState(sweetData.Content);
    const [idAfterUpdatedSweet, setIdAfterUpdatedSweet] = useState(sweetData._id);
    const [contentAferUpdateSweet, setContentAferUpdateSweet] = useState(sweetData.Content);

    const [showDialogHistory, setshowDialogHistory] = useState(false);





    const checkIsShare = async () => {
        try {
            if (sweetData && sweetData._id) {
          const response = await axiosClient.get(`/sweet/checkSweetOrShare?SweetID=${sweetData._id}`);
          if(response.data.isSuccess){
            if(response.data.data.State){
                setIsShare(false);
            }else {
                setIsShare(true);
            }
        }}

        } catch (error) {
          toast.error(error.response?.data.errorMessage ?? "Unexpected error");
        }
    };

    useEffect(() => {
        checkIsShare();
        fetchLikeStatus();
    }, [selectedTab]); 
  
    const fetchLikeStatus = async () => {
        try {
            if (sweetData && sweetData._id) {
                const response = await axiosClient.get(`/sweet/checkUserLike?SweetID=${sweetData._id}`);
                if (response.data.isSuccess) {
                    if (response.data.data.State) {
                        setIsLiked(true);
                    } else {
                        setIsLiked(false);
                    }
                }
            }

        } catch (error) {
            toast.error(error.response?.data.errorMessage ?? "Unexpected error");
        }
    }

    const handleCreateShareClick = () => {
        setShowDialogCreateShare(true);
    };

    const handleShowDialogCreateShare = (value) => {
        setShowDialogCreateShare(value);
    };

    const handleShowDialogGetQuantityShare = (value) => {
        setQuantityShare(value);
    };

    const countShare = async () => {
        try {
            if (!isShare) {
          const response = await axiosClient.get(`/sweet/countShare?SweetID=${sweetData._id}`);
          if(response.data.isSuccess){
            setQuantityShare(response.data.data.QuantityShare);
            
        }}

        } catch (error) {
          toast.error(error.response?.data.errorMessage ?? "Unexpected error");
        }
    };
    // useEffect(() => {
    //     countShare();
    // }, []);
    
    const handleGetListShareClick = () => {
        setShowDialog(true);
        setGetList(true);
    };

    const handleGetListLikeClick = () => {
        setShowDialog(true);
        setGetList(false);
    };

    const handleShowDialog = (value) => {
        setShowDialog(value);
    };

    const likeSweetHandle = async () => {
        try {
            const response = await axiosClient.put(`/sweet/addOrDeleleLike/${sweetData._id}`);
            
            if (response.data.isSuccess) {
                if (response.data.data.State) {
                    setIsLiked(false);
                } else {
                    setIsLiked(true);
                }
                setCheckIsLiked(response.data.isSuccess);

                setQuantityLike(response.data.data.QuantityLike);

            }

        } catch (error) {
            toast.error(error.response?.data.errorMessage ?? "Unexpected error");
        }
    }

    const handleOptionClick = () => {
        setIsOption(true);
    };
    const handleCancelOptionClick = () => {
        setIsOption(false);
    };

    const handleDeleteClick = async () => {
        try {
            if(!isShare){
                const response = await axiosClient.delete(`sweet/deleteSweet/${sweetData._id}`);
                if (response.data.isSuccess) {
                    toast.success("Xóa bài viết thành công.");
                    resetData();
                } else {
                    toast.error(response.errorMessage);
                }
            }else{
                const response = await axiosClient.delete(`share/deleteShare/${sweetData._id}`);
                if (response.data.isSuccess) {
                    toast.success("Xóa bài Share thành công.");
                    setQuantityShare(response.data.data.QuantityShare);
                    resetData();
                } else {
                    toast.error(response.errorMessage);
                }
            }
        } catch (error) {
            toast.error("Lỗi khi xóa bài viết");
        }
        setIsOption(false);
    };
      
    const handleDeleteTemporaryClick = async () => {
        try {
            const response = await axiosClient.delete(`sweet/deleteSweetTemporary/${sweetData._id}`);
            if (response.data.isSuccess) {
                toast.success("Bỏ bài viết vào thùng rác thành công.");
                resetData();
            } else {
                toast.error(response.errorMessage);
            }
        } catch (error) {
            toast.error("Lỗi khi bỏ bài viết vào thùng rác");
        }
        setIsOption(false);
    };

    const handleEditClick = () => {
    setIsEditing(true);
    setIsOption(false);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpdateClick = async () => {
        try {
            if(!isShare){
                const formData = new FormData();
                formData.append('content', updatedSweet);
                selectedFile && formData.append('image', selectedFile);     
                const response = await axiosClient.put(`sweet/updateSweet/${sweetData._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.data.isSuccess) {
                    setIdAfterUpdatedSweet(response.data.data._id);
                    setUpdatedSweet(response.data.data.Content);
                    setContentAferUpdateSweet(response.data.data.Content);
                    toast.success("Cập nhật bài viết thành công.");
                    // resetData();
                } else {
                    toast.error(response.errorMessage);
                }
            }else {
                const formData = new FormData();
                formData.append('content', updatedSweet);
                selectedFile && formData.append('image', selectedFile);     
                const response = await axiosClient.put(`share/updateShare/${sweetData._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.data.isSuccess) {
                    setIdAfterUpdatedSweet(response.data.data._id);
                    setUpdatedSweet(response.data.data.Content);
                    setContentAferUpdateSweet(response.data.data.Content);
                    toast.success("Cập nhật bài Share thành công.");
                    // resetData();
                } else {
                    toast.error(response.errorMessage);
                }                
            }
            
        } catch (error) {
            toast.error("Lỗi khi chỉnh sửa bài viết");
        }
        setIsEditing(false);
    };
    const handleCancelEditClick = () => {
        setIsEditing(false);
    };
      const handleDialogHistoryClick = async () => {
        setshowDialogHistory(true);
      };
      const handleShowDialogHistoryUpdate = (value) => {
        setshowDialogHistory(value);
        if(!value){
          setIsOption(false);
        }
      };
    return (
        <div className='single-post' >
            <div className='user-info' >
                <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' 
                onClick={() => {navigate(`/profile/${sweetData.UserName._id}`)}}
                />
                <div className='info-content' >
                    <div className='user-info-name'>
                        <span>{sweetData.UserName.displayName}</span>
                        <span>{sweetData.UserName.username}</span>
                    </div>
                    <div className='option-sigle-post'>
                            <span className='post-createdAt'>{sweetData.Duration}</span>
                            <div className='post-createdAt'> {/*option-sigle-post*/}
                            {isOption ? (
                            <div className='option-sweet'>
                            <button onClick={handleEditClick}>Chỉnh sửa</button>
                            <button onClick={() => handleDeleteClick()}>Xóa vĩnh viễn</button>
                            {!isShare ? (<button onClick={() => handleDeleteTemporaryClick()}>Xóa bỏ vào thùng rác</button>) : (null)}               
                            <button onClick={handleDialogHistoryClick}>Xem lịch sử chỉnh sửa</button>
                            <button onClick={handleCancelOptionClick}>Hủy</button>
                            </div>
                            ) : (
                            <span onClick={handleOptionClick}><FaEllipsisV/></span>
                            )}
                        </div>
                    </div>
                    
                </div>

                

            </div>
            
            <div className='single-post-content'>
                <div className='text-content' >
                {isEditing ? (
                    <div>
                    <textarea 
                    value={updatedSweet}
                    onChange={(e) => setUpdatedSweet(e.target.value)}
                    placeholder='Enter update Sweet...'
                    rows={3}
                    />

                    <div className='option-update-sweet'>
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
                                        <li></li>
                                        <li><AiOutlineFileGif /></li>
                                        <li><AiOutlineUnorderedList /></li>
                                        <li><BsEmojiSmile /></li>
                                        <li><SlCalender /></li>
                                        <li><CiLocationOn /></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>

                        <button id='btn-capnhat' onClick={() => handleUpdateClick()}>Update</button>
                        <button id='huy' onClick={handleCancelEditClick}>Cancel</button>
                    </div>
                    </div>
                ) : (
                    <span onClick={() => handleGetSweetDetail(idAfterUpdatedSweet)}>{contentAferUpdateSweet }</span>
                )}
                    
                </div>
                
                {isShare === true ? (
                    <div className='post-share' onClick={() => handleGetSweetDetail(sweetData.SweetID)}> 
                        <div className='user-info'>
                            <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                            <div className='info-content'>
                            <div className='user-info-name'>
                                <span>{sweetData.UserName_Origin?.displayName}</span>
                                <span>{sweetData.UserName_Origin?.username}</span>
                            </div>
                            <span className='post-createdAt'>{sweetData.Duration_Origin}</span>
                            </div>
                        </div>

                        <div className='single-post-content'> 
                            <div className='text-content' onClick={() => handleGetSweetDetail(sweetData._id)}>
                                <span >{sweetData.Content_Origin}</span>
                            </div>

                            <div className='image-content' onClick={() => handleGetSweetDetail(sweetData._id)}>
                            { sweetData.Image_Origin && sweetData.Image_Origin.map((item, index) => (
                                <img src={item} />
                                ))
                            }
                            </div>
                        </div>
                    </div>  
                

                ) : (null)}

                <div className='image-content' onClick={() => handleGetSweetDetail(sweetData._id)}>
                    {
                        sweetData.Image && sweetData.Image.map((item, index) => (
                            <img src={item} />
                        ))
                    }
                </div>

                <div className='react-content'>
                    <ul>
                        <li onClick={() => handleGetSweetDetail(sweetData._id)}><FaRegComment /> &nbsp; { sweetData.QuantityComment}</li>
                        <li><GiRapidshareArrow 
                                onClick={() => handleCreateShareClick(sweetData._id)}
                            /> 
                            {!isShare ? (
                            <span onClick={handleGetListShareClick}>&nbsp; {sweetData.QuantityShare}</span> ) 
                            : (null)}
                        </li>
                        
                        <li ><AiOutlineHeart
                                onClick={()=>likeSweetHandle()}
                                style={{ color: isLiked ? 'red' : 'white', cursor: 'pointer' }}
                            />      
                            <span onClick={handleGetListLikeClick}>&nbsp; {quantityLike}</span>
                        </li>
                        
                        <li onClick={() => handleGetSweetDetail(sweetData._id)}><BsReverseListColumnsReverse/> &nbsp; {835}</li>
                    </ul>
                </div>

                {showDialog && <Dialog sweet = {sweetData} getList={getList} onCloseDialog={handleShowDialog}/>}

                {showDialogCreateShare && <DialogShare sweet = {sweetData} onCloseDialog={handleShowDialogCreateShare} quantityShare={handleShowDialogGetQuantityShare}/>}

                {showDialogHistory && <DialogHistorySweet sweet={sweetData} onCloseDialog = {handleShowDialogHistoryUpdate}/>}
            </div>

        </div>
    )
}

export default SinglePost
