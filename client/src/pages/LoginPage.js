import React, { useState } from 'react';
import { BsTwitterX } from 'react-icons/bs';
import LoginOption from '../component/LoginOption';
import LoginModal from '../component/LoginModal';
function LoginPage(props) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className='root-container'>
                <div className='login-page w-full h-full '>
                    <div className='login-logo w-full'>
                        <BsTwitterX style={{ width: '100%', height: '100%', maxHeight: '400px', color: '#ffffff' }} />
                    </div>
                    <div className='login-content'>
                        <div className='title-content'>
                            <span>Đang diễn ra ngay bây giờ</span>
                        </div>
                        <div className='title-content-down'>
                            <span>Tham gia ngay</span>
                        </div>
                        <div className='login-menu'>
                            <LoginOption setModalShow={setShowModal} />
                        </div>
                    </div>


                </div>
                <LoginModal/>
            </div>
        </>
    );
}

export default LoginPage;
