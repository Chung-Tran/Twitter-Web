import React, { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import axiosClient from '../authenticate/authenticationConfig';
import { toast } from 'react-toastify';

function SweetComment({ commentData,resetData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedComment, setUpdatedComment] = useState(commentData.content);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick =async () => {
    try {
        const formData = new FormData();
        formData.append('content', updatedComment);
        const response = await axiosClient.put(`comment/updateComment/${commentData._id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.data.isSuccess) {
            setUpdatedComment('');
            toast.success("Cập nhật bình luận thành công.");
            resetData();
        } else {
            toast.error(response.errorMessage);
        }
    } catch (error) {
        toast.error("Lỗi khi chỉnh sửa bình luận");
    }
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setUpdatedComment(e.target.value);
  };

  return (
    <div className='sweet-comment-content'>
      <div className='userinfo'>
        <img src='https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
        <div className='userinfo-name'>
          <div>
            <span>{commentData.user_id.displayName}</span>
            <span>{commentData.created_at}</span>
          </div>
          <div>
            {isEditing ? (
              <button onClick={handleUpdateClick}>Update</button>
            ) : (
              <span onClick={handleEditClick}><EditOutlined /></span>
            )}
          </div>
        </div>
      </div>
      <div className='content'>
        <div className='text-content'>
          {isEditing ? (
            <textarea 
              value={updatedComment}
              onChange={handleChange}
              placeholder='Enter your comment...'
              rows={3}
            />
          ) : (
            <p>{commentData.content}</p>
          )}
        </div>
        <div className='images-content'>
          {commentData.image && commentData.image.map((item) => (
            <img key={item} src={item} alt="Comment Image" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SweetComment;
