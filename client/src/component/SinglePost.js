//import React, { useEffect, useState }from 'react'
import React, { useState, useEffect } from 'react';

import { FaRegComment } from "react-icons/fa";
import { GiRapidshareArrow } from "react-icons/gi";
import { AiOutlineHeart } from "react-icons/ai";
import { BsReverseListColumnsReverse } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axiosClient from '../authenticate/authenticationConfig';
import { toast } from 'react-toastify';

function SinglePost({ sweetData }) {
    const navigate = useNavigate();
    const handleGetSweetDetail = (_id) => {
        navigate(`/status/${_id}`)
    }

    const [checkIsLiked, setCheckIsLiked] = useState(false);
    const [isLiked, setIsLiked] = useState(true);
    const [quantityLike, setQuantityLike] = useState(sweetData.QuantityLike); 
    
    const fetchLikeStatus = async () => {
        try {
            if (sweetData && sweetData._id) {
          const response = await axiosClient.get(`/sweet/checkUserLike?SweetID=${sweetData._id}`);
          if(response.data.isSuccess){
            if(response.data.data.State){
                setIsLiked(true);
            }else {
                setIsLiked(false);
            }
        }}

        } catch (error) {
          toast.error(error.response?.data.errorMessage ?? "Unexpected error");
        }
      };

    useEffect(() => {
      fetchLikeStatus();
    }, [sweetData._id]); // Khi sweetData._id thay đổi, useEffect sẽ được gọi lại để kiểm tra lại trạng thái like

    
    const likeSweetHandle = async () => {
        try {
            const response = await axiosClient.put(`/sweet/addOrDeleleLike/${sweetData._id}`);
            if(response.data.isSuccess){
                if(response.data.data.State){
                    setIsLiked(false);
                }else{
                    setIsLiked(true);
                }
                setCheckIsLiked(response.data.isSuccess);

                setQuantityLike(response.data.data.QuantityLike);
                
            }

        } catch (error) {
            toast.error(error.response?.data.errorMessage ?? "Unexpected error");
        }
    }
    /*const likeSweetHandle = () => {
        axiosClient.put(`/sweet/addOrDeleleLike/${sweetData._id}`)
            .then(response => {
                console.log(response);
                if (response.data.isSuccess) {
                    if (response.data.data.State) {
                        setIsLiked(false);
                    } else {
                        setIsLiked(true);
                    }
                    setCheckIsLiked(response.data.isSuccess);
                    setQuantityLike(response.data.data.QuantityLike);
                }
            })
            .catch(error => {
                toast.error(error.response?.data.errorMessage ?? "Unexpected error");
            });
    };*/


    // useEffect(() => {
    //     likeSweetHandle();
    // }, [sweetData._id])

  

    return (
        <div className='single-post' >
            <div className='user-info'>
                <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                <div className='info-content'>
                    <div className='user-info-name'>
                        <span>{ sweetData.UserName.displayName}</span>
                        <span>{ sweetData.UserName.username}</span>
                    </div>
                    <span className='post-createdAt'>{sweetData.Duration}</span>

                </div>

            </div>
            <div className='single-post-content'>
                <div className='text-content' onClick={() => handleGetSweetDetail(sweetData._id)}>
                    <span >{sweetData.Content}</span>
                </div>
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
                        <li onClick={() => handleGetSweetDetail(sweetData._id)}><GiRapidshareArrow/> &nbsp;  {sweetData.QuantityLike}</li>
                        <li>     <AiOutlineHeart
        //                 style={{ color: (isLiked) ? 'red' : 'white' , cursor: 'pointer' }}
        onClick={()=>likeSweetHandle()}
        style={{ color: isLiked ? 'red' : 'white', cursor: 'pointer' }}
        
        // onClick={(sweetData && sweetData._id) ?
        //     likeSweetHandle():
         
        //     console.error("Sweet data or sweet ID is invalid.")
        // }
        
      />

                            
        {/* onClick={()=>likeSweetHandle()}
        style={{ color: isLiked ? 'red' : 'white', cursor: 'pointer' }} */}
      
        &nbsp;
        {quantityLike}
      </li>
                        {/* <li><AiOutlineHeart onClick={()=>likeSweetHandle()}/> &nbsp; { sweetData.QuantityLike}</li> */}
                        
                        <li onClick={() => handleGetSweetDetail(sweetData._id)}><BsReverseListColumnsReverse/> &nbsp; {835}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SinglePost
