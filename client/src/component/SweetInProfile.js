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

function SweetInProfile({user_id}) {
    const navigate = useNavigate();
    const handleGetSweetDetail = (_id) => {
        navigate(`/status/${_id}`, { state: { source: 'sweetDetail' } })
    }

    const [checkIsLiked, setCheckIsLiked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    // const [quantityLike, setQuantityLike] = useState(); 
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogCreateShare, setShowDialogCreateShare] = useState(false);
    const [getListSweet, setGetListSweet] = useState([]);
    const [isShare, setIsShare] = useState(false)

    const handleGetSweet = async () => {
        try {
           
          const response = await axiosClient.get(`/sweet/getSweetByUserID/${user_id}`);
          if(response.data.isSuccess){
            setGetListSweet(response.data.data.Info);
                console.log(response.data.data.Info);
            }

        } catch (error) {
          toast.error(error.response?.data.errorMessage ?? "Unexpected error");
        }
    };


    // const checkIsShare = async () => {
    //     try {
            
    //       const response = await axiosClient.get(`/sweet/checkSweetOrShare?SweetID=${sweetData._id}`);
    //       if(response.data.isSuccess){
    //         if(response.data.data.State){
    //             setIsShare(false);
    //         }else {
    //             setIsShare(true);
    //         }
    //     }

    //     } catch (error) {
    //       toast.error(error.response?.data.errorMessage ?? "Unexpected error");
    //     }
    // };

    useEffect(() => {
        handleGetSweet();
        console.log("alo");
        // checkIsShare();
        // fetchLikeStatus();
    }, [user_id]); 
  
    // const fetchLikeStatus = async () => {
    //     try {
    //         if (sweetData && sweetData._id) {
    //             const response = await axiosClient.get(`/sweet/checkUserLike?SweetID=${sweetData._id}`);
    //             if (response.data.isSuccess) {
    //                 if (response.data.data.State) {
    //                     setIsLiked(true);
    //                 } else {
    //                     setIsLiked(false);
    //                 }
    //             }
    //         }

    //     } catch (error) {
    //         toast.error(error.response?.data.errorMessage ?? "Unexpected error");
    //     }
    // }

    // const handleCreateShareClick = () => {
    //     setShowDialogCreateShare(true);
    // };

    // const handleShowDialogCreateShare = (value) => {
    //     setShowDialogCreateShare(value);
    // };
    
    // const handleGetListShareClick = () => {
    //     setShowDialog(true);
    //     setGetList(true);
    // };

    // const handleGetListLikeClick = () => {
    //     setShowDialog(true);
    //     setGetList(false);
    // };

    // const handleShowDialog = (value) => {
    //     setShowDialog(value);
    // };

    // const likeSweetHandle = async () => {
    //     try {
    //         const response = await axiosClient.put(`/sweet/addOrDeleleLike/${sweetData._id}`);
            
    //         if (response.data.isSuccess) {
    //             if (response.data.data.State) {
    //                 setIsLiked(false);
    //             } else {
    //                 setIsLiked(true);
    //             }
    //             setCheckIsLiked(response.data.isSuccess);

    //             setQuantityLike(response.data.data.QuantityLike);

    //         }

    //     } catch (error) {
    //         toast.error(error.response?.data.errorMessage ?? "Unexpected error");
    //     }
    // }

    return (
        <div>
        
        
        {getListSweet.map((item, index) => (
        <div className='single-post' style={{marginBottom: 20}}>
            <div className='user-info' style={{ display: 'flex', flexDirection: 'row' , marginBottom: 20}}>
                <img style={{borderRadius: '50%' ,width: '7%', height: '7%', marginRight: 20}} src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                <div className='info-content'>
                    <div className='user-info-name'>
                        <span>{item.UserName.displayName}</span>
                        <span style={{color: 'red', marginLeft: 10}}>{item.UserName.username}</span>
                    </div>
                    <span className='post-createdAt' style={{opacity: 0.5}}>{item.Duration}</span>

                </div>

            </div>
            
            <div className='single-post-content'>
                <div className='text-content'>
                    <span >{item.Content}</span>
                </div>
                
                {/* {isShare === true ? (
                    <div className='post-share'> 
                        <div className='user-info'>
                            <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                            <div className='info-content'>
                            <div className='user-info-name'>
                                <span>{getListSweet.UserName_Origin?.displayName}</span>
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
                

                ) : (null)} */}

                <div className='image-content'  >
                    {
                        item.Image && item.Image.map((item1, index) => (
                            <img src={item1} style={{maxWidth:'600px'}}/>
                        ))
                    }
                </div>

                <div className='react-content'>
                    <ul>
                        <li ><FaRegComment /> &nbsp; { item.QuantityComment}</li>
                        <li><GiRapidshareArrow 
                                
                            /> 
                            {!isShare ? (
                            <span >&nbsp; {item.QuantityShare}</span> 
                            ) : (null)}
                        </li>
                        
                        <li ><AiOutlineHeart
                                // onClick={()=>likeSweetHandle()}
                                // style={{ color: isLiked ? 'red' : 'white', cursor: 'pointer' }}
                            />      
                            <span >&nbsp; {item.QuantityLike}</span>
                        </li>
                        
                        <li ><BsReverseListColumnsReverse/> &nbsp; {835}</li>
                    </ul>
                </div>

                {/* {showDialog && <Dialog sweet = {sweetData} getList={getList} onCloseDialog={handleShowDialog}/>}

                {showDialogCreateShare && <DialogShare sweet = {sweetData} onCloseDialog={handleShowDialogCreateShare}/>} */}

            </div>
        </div>
        ))}
        </div>
    )
}

export default SweetInProfile
