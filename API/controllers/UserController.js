const asyncHandle = require('express-async-handler')
const User = require('../model/User');
const formatResponse = require('../common/ResponseFormat');

const registerUser = asyncHandle(async (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const existData = await User.findOne({ email: email } || { username: username });
    if (existData) {
        return res.status(400).json(formatResponse(null, false, "Register failed!! Try again with other username or email."));
    }
    const newUser = await User.create(req.body);
    return res.status(200).json(formatResponse(newUser, true, "Register user successfully!"));
});
module.exports={registerUser,testController}