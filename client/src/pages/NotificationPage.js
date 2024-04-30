import React from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
function NotificationPage() {
    
  return (
    <div className='notify-container'>
          <div className='notify-header'>
              <div className='notify-title'>
                  <span>Notifications</span>
                  <span><IoSettingsOutline/></span>
              </div>
              <div className='list-type-notify'>
                  <ul>
                      <li>All</li>
                      <li>Verified</li>
                      <li>Mentions</li>
                  </ul>
              </div>
          </div>
          <div className='notify-list'>
              <div className='notify-single'>
                  <div className='notify-title'>
                  <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                  <span><IoSettingsOutline/></span>
                  </div>
                  <div className='notify-content'>
                      <p>Xe gôn Tầu của quân xâm lược Nga có EW chống drone fpv nhưng xem ra không ăn thua chỉ hơi nhiễu tí, dí sát thế này toi mạng rồi.</p>
                      <p>5 giờ trước</p>
                  </div>
                  
              </div>
          </div>
    </div>
  )
}

export default NotificationPage
