import React, { useState } from 'react';
import { Modal } from 'antd';
import { BsTwitterX } from 'react-icons/bs';
import './ModalStyle.scss';

function LoginModal({ visible, setVisible }) {
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    const handleCloseModal = () => {
        setVisible(false);
        setIsForgotPassword(false);
        setOtpSent(false);
        setNewPassword('');
        setOtpCode('');
        setIsSuccess(false);
        setIsRegister(false);
    };

    const handleSendOtp = () => {
        // Gửi yêu cầu OTP
        setOtpSent(true);
    };

    const handleVerifyOtp = () => {
        // Xác thực OTP và đặt mật khẩu mới
        setIsSuccess(true); // Thay đổi thành true nếu xác thực thành công
    };

    const handleResetPassword = () => {
        // Đặt lại mật khẩu mới
        // Thực hiện logic đặt lại mật khẩu ở đây
        setIsSuccess(true); // Thay đổi thành true nếu đặt lại thành công
    };

    return (
        <Modal
            centered
            visible={visible}
            width={450}
            className='modal-style'
            footer={false}
            onCancel={handleCloseModal}
            destroyOnClose={true}
        >
            {isForgotPassword && !otpSent && !isSuccess ? (
                <>
                    <div className='modal-title !bg-black'>
                        <BsTwitterX style={{ margin: 'auto', width: '80%', height: '80%', maxHeight: '400px', color: 'black' }} />
                        <span>Quên mật khẩu</span>
                    </div>
                    <div className='modal-login'>
                        <span className='title-input-login'>Nhập email của bạn để lấy lại mật khẩu</span>
                        <input className='login-input ' placeholder='Email' />
                        <button onClick={handleSendOtp}>Gửi</button>
                    </div>
                </>
            ) : otpSent && !isSuccess ? (
                <>
                    <div className='modal-title !bg-black'>
                        <BsTwitterX style={{ margin: 'auto', width: '80%', height: '80%', maxHeight: '400px', color: 'black' }} />
                        <span>Xác thực OTP</span>
                    </div>
                    <div className='modal-login'>
                        <span className='title-input-login'>Nhập mã OTP được gửi đến email của bạn</span>
                        <input className='login-input ' placeholder='OTP' />
                        <button onClick={handleVerifyOtp}>Xác thực</button>
                    </div>
                </>
            ) : isSuccess ? (
                <>
                    <div className='modal-title !bg-black'>
                        <BsTwitterX style={{ margin: 'auto', width: '80%', height: '80%', maxHeight: '400px', color: 'black' }} />
                        <span>Đặt lại mật khẩu mới</span>
                    </div>
                    <div className='modal-login'>
                        <span className='title-input-login'>Nhập mật khẩu mới của bạn</span>
                        <input className='login-input ' placeholder='Mật khẩu mới' />
                        <input className='login-input ' placeholder='Nhập lại mật khẩu' />
                        <button onClick={handleResetPassword}>Đặt lại mật khẩu</button>
                    </div>
                </>
            ) : isRegister ? (
                <>
                    <div className='modal-title !bg-black'>
                        <BsTwitterX style={{ margin: 'auto', width: '80%', height: '80%', maxHeight: '400px', color: 'black' }} />
                        <span>Đăng ký</span>
                    </div>
                    <div className='modal-login'>
                        <span className='title-input-login'>Thông tin đăng ký</span>
                        {/* Thêm các trường nhập thông tin cho đăng ký */}
                        <input className='login-input ' placeholder='Email' />
                        <input className='login-input ' placeholder='Mật khẩu' type='password' />
                        <button>Đăng ký</button>
                    </div>
                    <div className='modal-orther-login'>
                        <span onClick={() => setIsRegister(false)}>Quay lại đăng nhập</span>
                    </div>
                </>
            ) : (
                <>
                    <div className='modal-title !bg-black'>
                        <BsTwitterX style={{ margin: 'auto', width: '80%', height: '80%', maxHeight: '400px', color: 'black' }} />
                        <span>Đăng nhập vào X</span>
                    </div>
                    <div className='modal-login'>
                        <span className='title-input-login'>Thông tin đăng nhập</span>
                        <input className='login-input ' placeholder='Email hoặc số diện thoại' />
                        <input className='login-input ' placeholder='Mật khẩu' type='password' />
                        <button>Đăng nhập</button>
                    </div>
                    <div className='modal-orther-login'>
                        <span onClick={() => setIsForgotPassword(true)}>Quên mật khẩu?</span>
                        <span onClick={() => setIsRegister(true)}>Không có tài khoản? <a>Đăng ký</a></span>
                    </div>
                </>
            )}
        </Modal>
    );
}

export default LoginModal;
