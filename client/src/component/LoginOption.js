import React, { useState } from 'react';
import LoginModal from './LoginModal';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GrFacebookOption } from "react-icons/gr";
function LoginOption() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleLogin = async (credentialResponse) => {
    // var obj = jwtDecode(credentialResponse.credential);
    // var data = JSON.stringify(obj);
    console.log(credentialResponse);
    const config = {
      method: 'POST',
      url: 'your backend server or endpoint',
      headers: {},
      // data: data
    }

  }

  return (
    <>
      <div className='login-option-container'>
        <div className='option-list'>
          <div className='google-option single-option'>
            <GoogleOAuthProvider clientId="229032397059-dgh41gson2bbvek02roal9d15n8injg1.apps.googleusercontent.com" className='google-login-button'>
            <GoogleLogin
              onSuccess={handleLogin}
              onError={() => {
                console.log('Login Failed');
              }}
            />
            </GoogleOAuthProvider>
           
          </div>
          <div className='facebook-option single-option'>
           <GrFacebookOption/> &nbsp;     Đăng nhập với Facebook
          </div>
          <span className='text-or'>hoặc</span>
          <div className='single-option register-option'>
            <span>Tạo tài khoản</span>
          </div>
          <span className='policy-register'>Khi đăng ký, bạn đã đồng ý với <a href="https://twitter.com/tos" rel="noopener noreferrer nofollow" target="_blank" role="link">Điều khoản Dịch vụ</a> và <a href="https://twitter.com/privacy" rel="noopener noreferrer nofollow" target="_blank" role="link">Chính sách Quyền riêng tư</a>, gồm cả <a href="https://help.twitter.com/rules-and-policies/twitter-cookies" rel="noopener noreferrer nofollow" target="_blank" role="link">Sử dụng Cookie</a>.</span>
          <div className='login-option'>
            <span>Đã có tài khoản?</span>
            <div className='single-option login-option-content register-option'>
              <span onClick={() => setIsModalVisible(!isModalVisible)}>Đăng nhập</span>
            </div>
          </div>
        </div>
      </div>

      {isModalVisible && <LoginModal visible={isModalVisible} setVisible={setIsModalVisible} />}
    </>
  );
}

export default LoginOption;
