import React, { useEffect, useState } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import axiosClient from '../authenticate/authenticationConfig';
function NotificationPage() {
    const [allNotify, setAllNotify] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('users/getallnotify');
                if (response.data.isSuccess) {
                    setAllNotify(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching user relate list:", error);
            }
        } 
        fetchData()
    },[])
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
              {allNotify && allNotify.map((item, index) => (
                  <div className='notify-single'>
                  <div className='notify-title'>
                  <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                  <span><IoSettingsOutline/></span>
                  </div>
                  <div className='notify-content'>
                          <p>{ item?.content}</p>
                      <p>5 giờ trước</p>
                  </div>
                  
              </div>
              ))}
          </div>
    </div>
  )
}

export default NotificationPage
