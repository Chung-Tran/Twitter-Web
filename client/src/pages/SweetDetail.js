import React, { useEffect, useState } from 'react'
import SinglePost from '../component/SinglePost'
import SweetComment from '../component/SweetComment'
import { AiOutlineFileGif } from "react-icons/ai";
import { useParams } from 'react-router-dom'; 
import axiosClient from '../authenticate/authenticationConfig';
import { toast } from 'react-toastify';

function SweetDetail() {
    const { id } = useParams(); 
    const [sweetDetail, setSweetDetail] = useState();
    console.log(sweetDetail)
    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosClient.get(`/sweet/getOneSweet?SweetID=${id}`);
            console.log(response)
              if (response.data.isSuccess) {
                setSweetDetail(response.data.data)
              } else {
                  toast.error(response.errorMessage);
              }
          };
          fetchData();
    },[])
    return (
        <div className='hompage-container'>
            <div className='homepage-post'>
                <div className='post-content'>
                   {sweetDetail &&  <SinglePost sweetData={sweetDetail}/>}
                </div>
                <div className='sweet-detail-comment'>
                    <div className='comment-frame'>
                        <div className='comment-avatar'>
                            <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                        </div>
                        <div className='comment-input'>
                            <div className='text-comment-input'>
                                <textarea
                                    placeholder='Post your reply'
                                />
                            </div>
                            <div className='text-comment-icon'>
                                <nav>
                                    <ul>
                                        <li><AiOutlineFileGif /></li>
                                        <li><AiOutlineFileGif /></li>
                                        <li><AiOutlineFileGif /></li>
                                        <li><AiOutlineFileGif /></li>
                                    </ul>
                                </nav>
                                <button>Reply</button>
                            </div>
                        </div>
                    </div>

                    <SweetComment />
                </div>
            </div>
        </div>
    )
}

export default SweetDetail
