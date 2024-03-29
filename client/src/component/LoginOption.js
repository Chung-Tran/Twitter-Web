import React, { useState } from 'react'
import LoginModal from './LoginModal';

function LoginOption() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  return (
    <div className='login-option-container'>
      <div className='option-list'>
        <div className='google-option single-option'>

        </div>
        <div className='apple-option single-option'>

        </div>
        <span className='text-or'>hoặc</span>
        <div className='single-option register-option'>
          <span>Tạo tài khoản</span>
        </div>
        <span class='policy-register'>Khi đăng ký, bạn đã đồng ý với <a href="https://twitter.com/tos" rel="noopener noreferrer nofollow" target="_blank" role="link">Điều khoản Dịch vụ</a> và <a href="https://twitter.com/privacy" rel="noopener noreferrer nofollow" target="_blank" role="link">Chính sách Quyền riêng tư</a>, gồm cả <a href="https://help.twitter.com/rules-and-policies/twitter-cookies" rel="noopener noreferrer nofollow" target="_blank" role="link">Sử dụng Cookie</a>.</span>
        <div className='login-option'>
          <span>Đã có tài khoản?</span>
          <div className='single-option login-option-content register-option'>
            <span onClick={() => setIsOpenModal(!isOpenModal)}>Đăng nhập</span>
            {isOpenModal && <LoginModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} />}
          </div>
        </div>
      </div>
   
    </div>
  )
}

export default LoginOption
