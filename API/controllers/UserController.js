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

/*const addFollowUser = asyncHandle(async (req, res) => {
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
});*/

const addFollowUser = asyncHandle(async (req, res) => {
    const userId = req.query.UserId;
    const followUserId = req.body.followUserId;
    if (!followUserId) {
        return res.status(400).json(formatResponse(null, false, "Not found user id"));
    }
    try {
        // Tìm người dùng hiện tại và người dùng được theo dõi
        const user = await User.findById(userId);
        const followUser = await User.findById(followUserId);
        if (!user || !followUser) {
            return res.status(400).json(formatResponse(null, false, "Not found user"));
            //remove return res.status(404).json({ message: 'User or follow user not found' });
        }

        // Thêm người dùng được theo dõi vào danh sách theo dõi của người dùng hiện tại
        if (!followUser.followers.includes(userId)) {

            followUser.followers.push(userId);
            user.following.push(followUserId);
            await followUser.save();
            await user.save();
            //Trả về dữ liệu
            const data = {
                userId: user._id,
                following: user.following.length,
                followUser: user.followers.length,
                message: "Follow user successfully"
            }
            res.status(200).json(formatResponse(data, true, ""));
        } else {
            followUser.followers = followUser.followers.filter(id => id != userId);

            await followUser.save();
            user.following = user.following.filter(id => id != followUserId);
            await user.save();
            const data = {
                userId: user._id,
                following: user.following.length,
                followUser: user.followers.length,
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

const searchUser = asyncHandle( async (req, res) => {
    
    const email = req.query.email;
    const username = req.query.username;
    console.log(email,username)

    const searchKeyWord = await User.find({
        $or: [
            email && { email: { $regex: email, $options: "i" } },
            username && { username: { $regex: username, $options: "i" } }
        ].filter(Boolean)
    });

    try {
        if(searchKeyWord.length > 0){
            const data = {
                QuantityResult: searchKeyWord.length,
                InFo_User: searchKeyWord
            }
            return res.status(200).json(formatResponse(data, true, "Tìm kiếm thành công!!"))
        }else return res.status(400).json(formatResponse("", false, "Không tìm thấy User!!"))

    } catch (error) {
        console.error("Lỗi khi tìm kiếm: ", error.message);
        return res.status(400).json(formatResponse("", false, "Lỗi khi tìm kiếm User!!"));
    }
})

const getListUserUnFollow = asyncHandle( async (req, res) => {
    
    const user_id = req.user.UserID;
    //const user_id = req.query.UserID;

    const allUsers = await User.find({});
    
    const user = await User.findById(user_id);
    
    const following = user.following;
    
    const usersNotFollowing = allUsers.filter((user) => !following.includes(user._id) && user._id.toString() !== user_id);
    
    console.log("Danh sách người dùng chưa theo dõi:", usersNotFollowing);
    
    try {
        const data = {
            QuantityResult: usersNotFollowing.length,
            InFo_User: usersNotFollowing
        }
        return res.status(200).json(formatResponse(data, true, "Lấy danh sách người dùng chưa follow thành công!!"))

    } catch (error) {
        console.error("Lỗi Lấy danh sách người dùng chưa Follow: ", error.message);
        return res.status(400).json(formatResponse("", false, "Lỗi khi Lấy danh sách người dùng chưa Follow!!"));
    }
})



module.exports = {editUser, addFollowUser,getUser, searchUser, getListUserUnFollow}
