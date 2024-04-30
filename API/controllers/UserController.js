const asyncHandle = require('express-async-handler')
const User = require('../model/User');
const formatResponse = require('../common/ResponseFormat');



const editUser = asyncHandle(async (req, res) => {
    const userId = req.user.userId;
    const email = req.user.email;
    const username = req.body.username;
    const bio = req.body.bio;
    const dob = req.body.dob;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { username, email, bio, dob }, { new: true });

        if (!updatedUser) {
            return res.status(400).json(formatResponse(null, false, "Update user false"));
        }
        const data = {
            username: updatedUser.username,
            email: updatedUser.email,
            bio: updatedUser.bio,
            dob: updatedUser.dob
        };
        res.status(200).json(formatResponse(data, true, ""));
    } catch (error) {
        console.error('Error editing user information:', error);
        res.status(500).json(formatResponse(null, false, "Update user false. Error:" + error.message));
    }
});

const addFollowUser = asyncHandle(async (req, res) => {
    const followUserId = req.body.followUserId;
    if (!followUserId) {
        return res.status(400).json(formatResponse(null, false, "Not found user id"));
    }
    try {
        // Tìm người dùng hiện tại và người dùng được theo dõi
        const user = await User.findById(req.user.userId);
        const followUser = await User.findById(followUserId);
        if (!user || !followUser) {
            return res.status(400).json(formatResponse(null, false, "Not found user"));
            //remove return res.status(404).json({ message: 'User or follow user not found' });
        }

        // Thêm người dùng được theo dõi vào danh sách theo dõi của người dùng hiện tại
        if (!followUser.followers.includes(req.user.userId)) {

            followUser.followers.push(req.user.userId);
            user.following.push(followUserId);
            await followUser.save();
            await user.save();
            //Trả về dữ liệu
            const data = {
                userId: followUser._id,
                following: followUser.following.length,
                followUser: followUser.followers.length,
                message: "Follow user successfully"
            }
            res.status(200).json(formatResponse(data, true, ""));
        } else {
            followUser.followers = followUser.followers.filter(id => id != req.user.userId);

            await followUser.save();
            user.following = user.following.filter(id => id != followUserId);
            await user.save();
            const data = {
                userId: followUser._id,
                following: followUser.following,
                followUser: followUser.followers,
                message: "Unfollow user successfully"
            }
            res.status(200).json(formatResponse(data, true, ""));
        }
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json(formatResponse(null, false, error.message));
    }
});

const getUser = asyncHandle(async (req, res) => {
    try {
        const id = req.params.id;
        // Query the database to find the user by id
        const user = await User.findById(id);

        // Check if user exists
        if (!user) {
            return res.status(404).json(formatResponse(null, false, "User not found"));
        }
        const data = {
            userId: user._id,
                following: user.following.length,
                followUser: user.followers.length,
                userName: user.username,
                displayName: user.displayName,
                bio: user.bio,
                dob: user.dob,

        }
        return res.status(200).json(formatResponse(data, true, ""));
        
    } catch (error) {
        console.error(error);
        res.status(500).json(formatResponse(null, false, "Internal Server Error"));
    }
});


module.exports = {editUser, addFollowUser,getUser}
