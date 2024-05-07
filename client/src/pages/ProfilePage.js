import React, { useEffect, useState } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import Post from '../component/post/post';
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosClient from '../authenticate/authenticationConfig';
import SinglePost from '../component/SinglePost';
import { BiMessageDots } from "react-icons/bi";
function ProfilePage() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState();
    const userId = JSON.parse(localStorage.getItem("twitter-user"))?._id; //ID người đang sử dụng
    const navigate=useNavigate()

    useEffect(() => {
        fetchData(id)
    }, [id]);
    const fetchData = async (id) => {
        try {
            let response;
            response = await axiosClient.get(`/users/${id}`);
            if (response.data.isSuccess) {
                setUserInfo(response.data.data)
            } else {
                toast.error(response.errorMessage);
            }
        } catch (error) {
            toast.error("Unexpected error");
        };
    }
    const ChatNow = () => {
        navigate(`/messages/${id}`)
    }
        return userInfo && (
            <div className='profile-container'>
                <div className='profile-page-header'>
                    <span><IoArrowBackSharp /></span>
                    <div className='header-title'>
                        <span>{userInfo.displayName}</span>
                        <span>{userInfo.statusList?.length} posts</span>
                    </div>
                </div>
                <div className='user-profile-container'>

                    <div className='profile-avatar'>
                        <div className='cover-images'>
                            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbrcbieHSe__U37eq3JOSPIGi4WVjdzn0GDw_jVv7Rnqq_UTvaAw3GkeXd_O575NU_nGw&usqp=CAU' />
                        </div>
                        <div className='avatar-image'>
                            <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' alt="Avatar" />
                            {id==userId ?  <button >Edit profile</button> : <button style={{border:'none'}} onClick={()=>ChatNow()}><BiMessageDots style={{color:'#555', fontSize:'28px'  }}/></button>}
                        </div>
                    </div>
                    <div className='profile-user-info'>
                        <div className='username'>
                            <span>{userInfo.displayName}</span>
                            <span>@{userInfo.userName}</span>
                        </div>
                        <ul>
                            {userInfo?.dob && <li id='profile-desc'>{userInfo?.dob}</li>}
                            <li id='profile-join-time'><FaCalendarAlt style={{ color: 'rgb(115 95 95)' }} /> &nbsp;{userInfo?.createdAt}</li>
                            <ul >
                                <li>{userInfo?.following ?? 0} &nbsp;&nbsp;<p>Following</p></li>
                                <li>{userInfo?.followUser ?? 0} &nbsp;&nbsp;<p>Followers</p></li>
                            </ul>
                        </ul>
                    </div>
                </div>
                <div className='style-show-profile'>
                    <ul>
                        <li id='select-type-post'>Posts</li>
                        <li>Replies</li>
                        <li>Hightlights</li>
                        <li>Articles</li>
                        <li>Media</li>
                        <li>Likes</li>
                    </ul>
                    <div className='profile-show-tweet'>
                        {/* {userInfo?.statusList && userInfo.statusList.map((item, index) => (
                            <SinglePost sweetData={item} selectedTab="For you"/>
                        ))} */}
                        
                    </div>
                </div>

            </div>
        )
    }

    export default ProfilePage;
