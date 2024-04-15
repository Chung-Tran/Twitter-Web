import React from 'react'
import { FaRegComment } from "react-icons/fa";
import { GiRapidshareArrow } from "react-icons/gi";
import { AiOutlineHeart } from "react-icons/ai";
import { BsReverseListColumnsReverse } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
function SinglePost({ sweetData }) {
    const navigate = useNavigate();
    const handleGetSweetDetail = (_id) => {
        navigate(`/status/${_id}`)
    }
    console.log(sweetData)
    return (
        <div className='single-post' onClick={() => handleGetSweetDetail(sweetData._id)}>
            <div className='user-info'>
                <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                <div className='info-content'>
                    <div className='user-info-name'>
                        <span>{ sweetData.user_id.displayName}</span>
                        <span>@user_12345</span>
                    </div>
                    <span className='post-createdAt'>17h</span>

                </div>

            </div>
            <div className='single-post-content'>
                <div className='text-content'>
                    <span >{sweetData.content}</span>
                </div>
                <div className='image-content'>
                    {
                        sweetData.image && sweetData.image.map((item, index) => (
                            <img src={item} />
                        ))
                    }
                </div>
                <div className='react-content'>
                    <ul>
                        <li><FaRegComment /> &nbsp; { sweetData.quantityComment}</li>
                        <li><GiRapidshareArrow/> &nbsp; { sweetData.quantityComment}</li>
                        <li><AiOutlineHeart/> &nbsp; { sweetData.quantityLike}</li>
                        <li><BsReverseListColumnsReverse/> &nbsp; { sweetData.quantityShare}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SinglePost
