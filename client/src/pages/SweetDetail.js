import React, { useEffect } from 'react'
import SinglePost from '../component/SinglePost'
import SweetComment from '../component/SweetComment'
import { AiOutlineFileGif } from "react-icons/ai";
import { useParams } from 'react-router-dom';
function SweetDetail() {
    const { id } = useParams(); 
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
    },[])
    return (
        <div className='hompage-container'>
            <div className='homepage-post'>
                <div className='post-content'>
                    {/* <SinglePost sweetData={}/> */}
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
