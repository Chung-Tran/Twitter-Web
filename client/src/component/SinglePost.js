import React from 'react'
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
    const likeSweetHandle = async () => {
        try {
            const response = await axiosClient.put(`/sweet/addOrDeleleLike/${sweetData._id}`);
            console.log(response)
        } catch (error) {
            toast.error(error.response?.data.errorMessage ?? "Unexpected error");
        }
       

    }
    return (
        <div className='single-post' >
            <div className='user-info'>
                <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                <div className='info-content'>
                    <div className='user-info-name'>
                        <span>{ sweetData.UserName.displayName}</span>
                        <span>{ sweetData.UserName.username}</span>
                    </div>
                    <span className='post-createdAt'>17h</span>

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
                        <li onClick={() => handleGetSweetDetail(sweetData._id)}><FaRegComment /> &nbsp; { sweetData.QUantityComment}</li>
                        <li onClick={() => handleGetSweetDetail(sweetData._id)}><GiRapidshareArrow/> &nbsp; { sweetData.QUantityComment}</li>
                        <li><AiOutlineHeart onClick={()=>likeSweetHandle()}/> &nbsp; { sweetData.QuantityLike}</li>
                        <li onClick={() => handleGetSweetDetail(sweetData._id)}><BsReverseListColumnsReverse/> &nbsp; { sweetData.QuantityShare}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SinglePost
