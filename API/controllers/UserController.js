const asyncHandle = require('express-async-handler')
const User = require('../model/User');
const formatResponse = require('../common/ResponseFormat');



const editUser = asyncHandle(async(req, res) => {
    const userId = req.params;
    const email = req.body.email;
    const username = req.body.username;
    
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { username, email }, { new: true });
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User information updated', user: updatedUser });
    } catch (error) {
        console.error('Error editing user information:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

const addFollowUser = asyncHandle(async(req, res) => {
    const userId  = req.params;
    const followUserId = req.params;
    try {
        // Tìm người dùng hiện tại và người dùng được theo dõi
        const user = await User.findById(userId);
        const followUser = await User.findById(followUserId);
        
        if (!user || !followUser) {
            return res.status(404).json({ message: 'User or follow user not found' });
        }
        
        // Thêm người dùng được theo dõi vào danh sách theo dõi của người dùng hiện tại
        if (!user.following.includes(followUserId)) {
            user.following.push(followUserId);
            await user.save();
            res.status(200).json({ message: 'User followed successfully' });
        } else {
            res.status(400).json({ message: 'User already followed' });
        }
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});
  
const removeFollowUser = asyncHandle(async(req, res) => {
    const userId  = req.params;
    const followUserId = req.params;
    
    try {
        // Tìm người dùng hiện tại
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Xóa người dùng được theo dõi khỏi danh sách theo dõi của người dùng hiện tại
        if (user.following.includes(followUserId)) {
            user.following = user.following.filter(id => id !== followUserId);
            await user.save();
            res.status(200).json({ message: 'User unfollowed successfully' });
        } else {
            res.status(400).json({ message: 'User not followed' });
        }
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

module.exports = {editUser, addFollowUser, removeFollowUser}
