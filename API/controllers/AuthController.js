const User = require('../model/User');
const bcrypt = require('bcrypt');
const asyncHandle = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { generateRefreshToken, generateAccessToken } = require('../common/CommonFunctions');
const formatResponse = require('../common/ResponseFormat');

const loginUser = asyncHandle(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        const isPasswordMatched = await user.isPasswordMatched(password);
        if (isPasswordMatched) {
            const refreshToken = generateRefreshToken(user);
            await User.findByIdAndUpdate(user._id, { refreshToken });
            const accessToken =await user.generateNewAccessToken(user);
           
            if (!accessToken.isSuccess) {
                return res.status(401).json(formatResponse(null, false,accessToken.errorMessage));
            }
            res.cookie('accessToken', accessToken);
            return res.status(200).json(formatResponse(user, true, "Login successfully"));
        } else {
            return res.status(401).json(formatResponse(null, false, "Invalid password"));
        }
    } else {
        return res.status(404).json(formatResponse(null, false, "User not found"));
    }
});


module.exports = { loginUser };

