//Controller xử lí người dùng đăng nhập, xác thực người dùng
const User = require('../model/User');
const crypto = require('crypto');
const asyncHandle = require('express-async-handler');
const {generateToken,generateSessionToken,authenticationToken} = require('../middleware/authMiddleware')

const loginUser = asyncHandle(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {

        const refeshToken = generateToken(findUser?._id);

        const updateUser = await User.findByIdAndUpdate(findUser._id, { refeshToken: refeshToken }, { new: true });
        res.cookie("refeshToken", refeshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.cookie('refeshToken',generateRefeshToken)
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            password: findUser?.password,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        })
    } else {
        throw new Error("Invalid credential");
    }
});
module.exports={loginUser}