import React, { useEffect, useState } from 'react'
import SinglePost from '../component/SinglePost'
import SweetComment from '../component/SweetComment'
import { AiOutlineFileGif } from "react-icons/ai";
import { useParams } from 'react-router-dom';
import axiosClient from '../authenticate/authenticationConfig';
import { toast } from 'react-toastify';
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmile } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";

function SweetDetail() {
    const { id } = useParams();
    const [sweetDetail, setSweetDetail] = useState();
    const [postCommentContent, setPostCommentContent] = useState();
    const [selectedFile, setSelectedFile] = useState([]);
    const fetchData = async () => {
        const response = await axiosClient.get(`/sweet/getOneSweet?SweetID=${id}`);
        console.log(response)
        if (response.data.isSuccess) {
            setSweetDetail(response.data.data)
        } else {
            toast.error(response.errorMessage);
        }
    };
    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, []);
    const potstCommentHandle = async () => {
        try {
            const formData = new FormData();
            formData.append('content', postCommentContent);
            selectedFile && formData.append('image', selectedFile);
            const response = await axiosClient.post(`comment/createComment/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.isSuccess) {
                setPostCommentContent('');
                toast.success("Bình luận bài viết thành công.");
                fetchData();
            } else {
                toast.error(response.errorMessage);
            }
        } catch (error) {
            console.error("Error posting content:", error);
            toast.error("Lỗi khi bình luận bài viết");
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        // Create a preview image URL for the selected file
        // const reader = new FileReader();
        // reader.onload = () => {
        //   setPreviewImage(reader.result);
        // };
        // reader.readAsDataURL(file);
    };
    return (
        <div className='hompage-container'>
            <div className='homepage-post'>
                <div className='post-content'>
                    {sweetDetail && <SinglePost sweetData={sweetDetail} />}
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
                                    name="postSweetContent"
                                    value={postCommentContent}
                                    onChange={(e) => setPostCommentContent(e.target.value)}
                                />
                            </div>
                            <div className='text-comment-icon'>
                                <nav>
                                    <ul>
                                        <li>
                                            {/* Hiển thị icon CiImageOn */}
                                            <label htmlFor="fileInput" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '22px' }}>
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
                                        <li><BsEmojiSmile /></li>
                                        <li><SlCalender /></li>
                                    </ul>
                                </nav>
                                <button onClick={potstCommentHandle}>Reply</button>
                            </div>
                        </div>
                    </div>
                    {
                        sweetDetail && sweetDetail.ListUserToComment.map((item, index) => (
                            <SweetComment commentData={item} resetData={fetchData} />
                        ))
                    }

                </div>
            </div>
        </div>
    )
}

export default SweetDetail
