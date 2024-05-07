import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from "react-icons/ai";
import { CgMoreAlt } from "react-icons/cg";
import axiosClient from '../authenticate/authenticationConfig';
import { FaCircle } from "react-icons/fa";

const Menu = () => {
    const [userRelateList, setUserRelateList] = useState([]);
    const [userListOnline, setUserListOnline] = useState([]);
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3 * 60 * 1000); // 3 phút
    
        return () => clearInterval(interval);
    }, []);
    const fetchData = async () => {
        try {
            const userUnfollowResponse = await axiosClient.get('users/getListUserUnFollow');
            if (userUnfollowResponse.data.isSuccess) {
                const userRelateData = userUnfollowResponse.data.data.map(user => ({ ...user, isFollow: false }));
                setUserRelateList(userRelateData);
            }
            
            const userOnlineResponse = await axiosClient.get('users/getuseronline');
            if (userOnlineResponse.data.isSuccess) {
                setUserListOnline(userOnlineResponse.data.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleFollowToggle = async (id, index) => {
        try {
            const response = await axiosClient.post('users/addFollow', { followUserId: id });
            if (response.data.isSuccess) {
                const action = response.data.data.action;
                const updatedUserRelateList = [...userRelateList];

                if (action === 'follow') {
                    updatedUserRelateList[index].isFollow = true;
                } else if (action === 'unfollow') {
                    updatedUserRelateList[index].isFollow = false;
                }

                setUserRelateList(updatedUserRelateList);

                if (action === 'follow') {
                    setTimeout(() => {
                        fetchData()
                    }, 1000); // 3 seconds
                }
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    };

    return (
        <div className='homepage-menu'>
            <nav className='search'>
                <ul>
                    <li><span><AiOutlineSearch /></span>Search</li>
                </ul>
            </nav>
            <div className='subscribe'>
                <nav>
                    <ul>
                        <li>Subscribe to Premium</li>
                        <li>Subscribe to unclock new features and if eligible, receive a share of ads revenue.</li>
                        <li>Subscribe</li>
                    </ul>
                </nav>
            </div>
            {/* Who to follow */}
            <div className='user-relate'>
                <div>Who to follow</div>
                {userRelateList && userRelateList.map((item, index) => (
                    <ul key={index}>
                        <li>
                            <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' alt="Avatar" />
                        </li>
                        <li>
                            <div>
                                <span>{item.displayName}</span>
                                <span>{"@" + item.username}</span>
                            </div>
                        </li>
                        <li>
                            <button onClick={() => handleFollowToggle(item._id, index)}>
                                {item.isFollow ? "Đã follow" : "Follow"}
                            </button>
                        </li>
                    </ul>
                ))}
            </div>
            {/*Friend online*/}
            <div className='user-relate' style={{ minHeight: '140px' }}>
                <div>Contacts</div>
                {userListOnline && userListOnline.map((item, index) => (
                    <ul key={index}>
                        <li>
                            <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' alt="Avatar" />
                        </li>
                        <li>
                            <div>
                                <span>{item.displayName}</span>
                                <span>{"@" + item.username}</span>
                            </div>
                        </li>
                        <li style={{ fontSize: '12px', color: ' #e9e900' }}>
                            <FaCircle />
                        </li>
                    </ul>
                ))}
            </div>
        </div>
    );
};

export default Menu;
