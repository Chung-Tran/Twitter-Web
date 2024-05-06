import React from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import Post from '../component/post/post';
function ProfilePage() {
    return (
        <div className='profile-container'>
            <div className='profile-page-header'>
                <IoArrowBackSharp />
                <div className='header-title'>
                    <span>Díplayname</span>
                    <span>username</span>
                </div>
            </div>
            <div className='user-profile-container'>

                <div className='profile-avatar'>
                    <div className='cover-images'>
                        <img src='../../assets/images/cover-image.jpg' />
                    </div>
                    <div className='avatar-image'>
                        <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' alt="Avatar" />
                        <button >Edit profile</button>
                    </div>
                </div>
                <div className='profile-user-info'>
                    <div className='username'>
                        <span>Displayname</span>
                        <span>username</span>
                    </div>
                    <ul>
                        <li id='profile-desc'>Description</li>
                        <li id='profile-join-time'>Joined August 2023</li>
                        <ul >
                            <li>5 Following</li>
                            <li>0 Followers</li>
                        </ul>
                    </ul>
                </div>
            </div>
            <div className='style-show-profile'>
                <ul>
                    <li>Posts</li>
                    <li>Replies</li>
                    <li>Hightlights</li>
                    <li>Articles</li>
                    <li>Media</li>
                    <li>Likes</li>
                </ul>
                <div className='profile-show-tweet'>
                {/* <Post/> */}
                </div>
            </div>

        </div>
    )
}

export default ProfilePage
