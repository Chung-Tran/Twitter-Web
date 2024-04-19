import React from 'react'

function SweetComment() {
  return (
    <div className='sweet-comment-content'>
          <div className='userinfo'>
              <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
              <div className='userinfo-name'>
                  <span>Display name</span>
                  <span> 15/5/2024 </span>
              </div>
          </div>
          <div className='content'>
              <div className='text-content'>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>
              </div>
              <div className='images-content'>
                  <img src='https://image.tienphong.vn/w890/Uploaded/2024/qhj_hiobgobrfc/2018_11_10/Tim_hieu_ve_cho_husky_1__KGXZ.jpg'/>
              </div>
          </div>
    </div>
  )
}

export default SweetComment
