//import React, { useEffect, useState }from 'react'
import React, { useState, useEffect } from 'react';

import { FaRegComment } from "react-icons/fa";
import { GiRapidshareArrow } from "react-icons/gi";
import { AiOutlineHeart } from "react-icons/ai";
import { BsReverseListColumnsReverse } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axiosClient from '../authenticate/authenticationConfig';
import { toast } from 'react-toastify';
import  Dialog  from '../component/Dialog'
import DialogShare from './DialogShare';

function SinglePost({sweetData, selectedTab, resetData}) {
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
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogCreateShare, setShowDialogCreateShare] = useState(false);
    const [getList, setGetList] = useState();
    const [isShare, setIsShare] = useState(false)

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
        // try {
        //     if (sweetData && sweetData._id) {
        //         const response = await axiosClient.get(`/sweet/checkUserLike?SweetID=${sweetData._id}`);
        //         if (response.data.isSuccess) {
        //             if (response.data.data.State) {
        //                 setIsLiked(true);
        //             } else {
        //                 setIsLiked(false);
        //             }
        //         }
        //     }

        // } catch (error) {
        //     toast.error(error.response?.data.errorMessage ?? "Unexpected error");
        // }
    }

    const handleCreateShareClick = () => {
        setShowDialogCreateShare(true);
    };

    const handleShowDialogCreateShare = (value) => {
        setShowDialogCreateShare(value);
    };
    
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

    return (
        <div className='single-post' >
            <div className='user-info' onClick={() => handleGetSweetDetail(sweetData._id)}>
                <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                <div className='info-content'>
                    <div className='user-info-name'>
                        <span>{sweetData.UserName.displayName}</span>
                        <span>{sweetData.UserName.username}</span>
                    </div>
                    <span className='post-createdAt'>{sweetData.Duration}</span>

                </div>

            </div>
            
            <div className='single-post-content'>
                <div className='text-content' onClick={() => handleGetSweetDetail(sweetData._id)}>
                    <span >{sweetData.Content}</span>
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

                {showDialogCreateShare && <DialogShare sweet = {sweetData} onCloseDialog={handleShowDialogCreateShare}/>}

            </div>
        </div>
    )
}

export default SinglePost
