import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { BsTwitterX } from 'react-icons/bs';
import { useFormik } from 'formik';
import axiosClient from '../authenticate/authenticationConfig';
import { toast } from 'react-toastify';
import { DatePicker, Space } from 'antd';
function LoginModal({ visible, setVisible, type }) {
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [tokenResetPassword,setTokenResetPassword]=useState('')
    const { RangePicker } = DatePicker;
    useEffect(() => {
        if (type == 1) {
            setIsRegister(false);
            setIsForgotPassword(false);
        } else {
            setIsRegister(true);
            setIsForgotPassword(false);
        }
    }, [type])
    const handleCloseModal = () => {
        setVisible(false);
        setIsForgotPassword(false);
        setOtpSent(false);
        setNewPassword('');
        setOtpCode('');
        setIsSuccess(false);
        setIsRegister(false);
        setTokenResetPassword('');
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
        setIsSuccess(true); // Thay đổi thành true nếu đặt lại thành công
    };
    const handleSubmit = async (data) => {
        try {
            if (!isRegister && !isForgotPassword) { // Đăng nhập
                const response = await axiosClient.post('/authentication/login', data);
                if (response.data.isSuccess) {
                    toast.success("Đăng nhập thành công");
                } else { 
                    toast.error(response.errorMessage);
                }
            } else if (isRegister) { // Đăng ký
                const response = await axiosClient.post('/authentication/register', data);
                if (response.data.isSuccess) {
                    toast.success("Đăng ký thành công");
                    setIsRegister(false);
                    setOtpSent(true);
                } else {
                    toast.error(response.errorMessage);
                }
            } else if (isForgotPassword && otpSent && !isSuccess) { // Gửi mã OTP
                const response = await axiosClient.post('/authentication/forgot-password', data);
                if (response.data.isSuccess) {
                    toast.success("Gửi mã OTP thành công. Vui lòng kiểm tra email");
                    setTokenResetPassword(response.data.token);
                } else {
                    toast.error(response.errorMessage);
                }
            } else if (isForgotPassword && otpSent && !isSuccess) { // Xác thực OTP
                const response = await axiosClient.post('/authentication/authenticate-otp', { otpCode: data.code, token: tokenResetPassword });
                if (response.data.isSuccess) {
                    toast.success("Xác thực OTP thành công");
                    setIsSuccess(true);
                } else {
                    toast.error(response.errorMessage);
                }
            } else if (isForgotPassword && otpSent && isSuccess) { // Đặt lại mật khẩu
                const response = await axiosClient.post('/authentication/confirm-reset-password', { newPassword: data.password, token: tokenResetPassword });
                if (response.data.isSuccess) {
                    toast.success("Thay đổi mật khẩu thành công. Vui lòng đăng nhập");
                    handleCloseModal();
                } else {
                    toast.error(response.errorMessage);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data.errorMessage ?? "Lỗi không xác định");
        }
    }
    
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: '',
            password: '',
            dob: '',
            username: '',
            displayName: '',
            newPassword: '',
            code:''
        },
        onSubmit: (values) => {
            handleSubmit(values)
        },
    });
    return (
        <Modal
            centered
            open={visible}
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
                        <form onSubmit={formik.handleSubmit} >
                            <input className='login-input ' placeholder='Email' name='email' value={formik.values.email} onChange={formik.handleChange} />
                            <button  type='submit'>Gửi</button>
                        </form>

                    </div>
                    <div className='modal-orther-login'>
                        <span onClick={() => setIsForgotPassword(false)}>Quay lại đăng nhập</span>
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
                        <form onSubmit={formik.handleSubmit}>
                            <input className='login-input ' placeholder='OTP' name='code' value={formik.values.code} onChange={formik.handleChange} />
                            <button onClick={handleVerifyOtp} type='submit'>Xác thực</button>
                        </form>
                    </div>
                    <div className='modal-orther-login'>
                        <span onClick={() => setOtpSent(false)}>Quay lại nhập email</span>
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
                        <form onSubmit={formik.handleSubmit}>
                            <input className='login-input ' placeholder='Mật khẩu mới' name='password' value={formik.values.password} onChange={formik.handleChange} />
                            <input className='login-input ' placeholder='Nhập lại mật khẩu' name='newPassword' value={formik.values.newPassword} onChange={formik.handleChange} />
                            <button onClick={handleResetPassword} type='submit'>Đặt lại mật khẩu</button>
                        </form>
                    </div>
                    <div className='modal-orther-login'>
                        <span onClick={() => setIsSuccess(false)}>Quay lại đăng nhập</span>
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
                        <form onSubmit={formik.handleSubmit} >
                            <input className='login-input ' placeholder='Họ tên' name='fullName' value={formik.values.fullName} onChange={formik.handleChange} />
                            <input className='login-input ' placeholder='Tên người dùng' name='username' value={formik.values.username} onChange={formik.handleChange} />
                            <input className='login-input ' placeholder='Email' name='email' value={formik.values.email} onChange={formik.handleChange} />
                            <input className='login-input ' placeholder='Mật khẩu' name='password' value={formik.values.password} onChange={formik.handleChange} />
                            <div className='dob-input' name='email' value={formik.values.dob} onChange={formik.handleChange}>
                                <span>Ngày sinh</span>
                                <Space direction="vertical" size={15} className='w-full'>
                                    <DatePicker size='large' width={400} className='w-full' />
                                </Space>
                            </div>
                            <button type='submit'>Đăng ký</button>
                        </form>
                    </div>
                    <div className='modal-orther-login'>
                        <span onClick={() => setIsRegister(false)}>Đã có tài khoản? <a>Quay lại đăng nhập</a></span>
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
                        <form onSubmit={formik.handleSubmit} id='loginform'>
                            <input className='login-input ' placeholder='Email hoặc số diện thoại' name='email' value={formik.values.email} onChange={formik.handleChange} />
                            <input className='login-input ' placeholder='Mật khẩu' type='password' name='password' value={formik.values.password} onChange={formik.handleChange} />
                            <button type='submit' >Đăng nhập</button>
                        </form>

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
