import React, { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";
import axiosClient from '../authenticate/authenticationConfig';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { light } from '@material-ui/core/styles/createPalette';
import SinglePost from './SinglePost';
import { colors } from '@material-ui/core';


function DialogHistoryComment({comment, onCloseDialog}) {
    const navigate = useNavigate();
    const handleGetSweetDetail = (_id) => {
        navigate(`/status/${_id}`)
    }

    const [listHistoryUpdate, setListHistoryUpdate] = useState()
    const [QuantityUpdate, setQuantityUpdate] = useState();
    const [showDialog, setShowDialog] = useState(true);

    const handleCloseDialog = () => {
        setShowDialog(false); 
        onCloseDialog(false);
    };
    
    const getListHistoryUpdateHandle = async () => {
        console.log("ID: " ,comment._id);
        const response = await axiosClient.get(`/comment/getListHistoryUpdate?CommentID=${comment._id}`);
        if(response.data.isSuccess){
            setListHistoryUpdate(response.data.data.History_Update)
            setQuantityUpdate(response.data.data.UpdateNumber)
            console.log("Data:" ,response.data.data.History_Update);
        }else {
            toast.error(response.errorMessage);
        }
    }

    useEffect(() => {
        getListHistoryUpdateHandle();
    }, [comment._id]);
    
//dialog-history-update-comment-container
    
    return (
        <div className='dialog-historycomment-container'> 
            {showDialog && listHistoryUpdate ? (
                <div className="overlay">
                    <div className="dialog-historycomment">
                        <div className="dialog-historycomment-header">
                            {<h3>Comment này đã được chỉnh sửa {QuantityUpdate} lần</h3>}
                            <button className="close-button" onClick={() => handleCloseDialog()}>&times;</button>
                        </div>

                        <div className="dialog-historycomment-content">
                            {listHistoryUpdate.length > 0 ? (
                                <p>{listHistoryUpdate.map((item, index) => (
                                    <div key={index} className='user-like'>
                                        
                                        <div className='content' style={{ color: 'red' }}>&nbsp;{item.Content}</div> 
                                        
                                        <div className='image-content' >
                                            {
                                                item.Image && item.Image.map((items, index) => (
                                                    <img src={items} />
                                                ))
                                            }
                                        </div>
                                        <p>&nbsp;{item.Duration} ({item.UpdateAt})</p>
                                    </div>
                                ))}</p>
                            ):(<div style={{color: 'red'}}><p>Không có lịch sử chỉnh sửa</p></div>)}
                            
                        </div>
                    </div>
                </div>
            ): (null)
            }
        </div>

    )

}

export default DialogHistoryComment
