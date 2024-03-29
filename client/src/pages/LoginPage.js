import React from 'react'
import { BsTwitterX } from "react-icons/bs";
import LoginOption from '../component/LoginOption';
function LoginPage(props) {
    return (
        <div className='login-page'>
            <div className='login-logo'>
                <BsTwitterX width={400} height={400} color='#ffffff' />
            </div>
            <div className='login-content'>
                <div className='title-content'>
                    <span>Đang diễn ra ngay bây giờ</span>

                </div>
                <div className='title-content-down'>
                    <span>Tham gia ngay</span>
                </div>
                <div className='login-menu'>
                    <LoginOption />
                </div>
            </div>
        </div>
    )
}


export default LoginPage

