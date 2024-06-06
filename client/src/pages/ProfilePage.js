import React, { useEffect, useState } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosClient from '../authenticate/authenticationConfig';
import SinglePost from '../component/SinglePost';
import { BiMessageDots } from "react-icons/bi";
import EditProfileModal from '../component/EditProfileModal';
import FollowViewModal from '../component/followViewModal';
function ProfilePage() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState();
    const userId = JSON.parse(localStorage.getItem("twitter-user"))?._id; //ID người đang sử dụng
    const navigate = useNavigate()

    const [getListSweet, setGetListSweet] = useState([]);
    const [selectedTab, setSelectedTab] = useState('Posts');

    useEffect(() => {
        id && fetchData()
    }, [id]);
    const fetchData = async () => {
        try {
            let response;
            response = await axiosClient.get(`/users/${id}`)
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

    const handleGetSweet = async () => {
        try {
            const response = await axiosClient.get(`/sweet/getSweetByUserID/${id}`);
            if (response.data.isSuccess) {
                setGetListSweet(response.data.data.Info);
            }

        } catch (error) {
            toast.error(error.response?.data.errorMessage ?? "Unexpected error");
        }
    };

    useEffect(() => {
        if (selectedTab === 'Posts') {
            handleGetSweet();
        }
    }, [selectedTab]);

    return userInfo && (
        <div className='hompage-container' >

            <div className='profile-container' >

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
                            <img src={!!userInfo?.avatar ? userInfo.avatar : 'https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg'} alt="Avatar" />
                            <div style={{ alignItems: 'center', display: 'flex', marginTop: '45px' }}>
                                {id != userId && <button>{userInfo.following.some(user => user._id === userId) ? "Theo dõi" : "Bỏ theo dõi"}</button>}
                                {id == userId ? <EditProfileModal handleReload={fetchData} /> : <button style={{ border: 'none' }} onClick={() => ChatNow()}><BiMessageDots style={{ color: '#555', fontSize: '28px' }} /></button>}

                            </div>
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
                                <li>{userInfo?.following.length ?? 0} &nbsp;&nbsp;{<FollowViewModal type="following" userList={userInfo && userInfo.following} resetData={fetchData} />}</li>
                                <li>{userInfo?.followUser.length ?? 0} &nbsp;&nbsp;{<FollowViewModal type="followers" userList={userInfo && userInfo.followUser} resetData={fetchData} />}</li>
                            </ul>
                        </ul>
                    </div>
                </div>
                <div className='style-show-profile'>
                    <ul>
                        <li
                            onClick={() => setSelectedTab('Posts')}
                            style={{ cursor: 'pointer' }}
                            className={selectedTab === 'Posts' ? 'active' : ''}
                        >
                            Posts
                        </li>
                        <li
                            onClick={() => setSelectedTab('Replies')}
                            style={{ cursor: 'pointer' }}
                            className={selectedTab === 'Replies' ? 'active' : ''}
                        >
                            Replies
                        </li>
                        <li
                            onClick={() => setSelectedTab('Hightlights')}
                            style={{ cursor: 'pointer' }}
                            className={selectedTab === 'Hightlights' ? 'active' : ''}
                        >
                            Hightlights
                        </li>
                        <li
                            onClick={() => setSelectedTab('Articles')}
                            style={{ cursor: 'pointer' }}
                            className={selectedTab === 'Articles' ? 'active' : ''}
                        >
                            Articles
                        </li>
                        <li
                            onClick={() => setSelectedTab('Media')}
                            style={{ cursor: 'pointer' }}
                            className={selectedTab === 'Media' ? 'active' : ''}
                        >
                            Media
                        </li>
                        <li
                            onClick={() => setSelectedTab('Likes')}
                            style={{ cursor: 'pointer' }}
                            className={selectedTab === 'Likes' ? 'active' : ''}
                        >
                            Likes
                        </li>
                    </ul>

                    <div className='sweet-in-profile'>
                        {selectedTab === 'Posts' ? (
                            <div style={{ marginTop: 20, marginLeft: 20 }}>
                                {getListSweet && getListSweet.map((item, index) => (
                                    <div key={index} className='post-content-by-user'>
                                        <SinglePost sweetData={item} selectedTab={selectedTab} resetData={fetchData} />
                                    </div>
                                ))}
                            </div>

                        ) : (null)}
                    </div>




                </div>




            </div>
        </div>
    )
}

export default ProfilePage;
