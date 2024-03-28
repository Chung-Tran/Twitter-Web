//Controller xử lí người dùng đăng nhập, xác thực người dùng
const User = require('../model/User');
const crypto = require('crypto');
const asyncHandle = require('express-async-handler');
const {generateToken,generateSessionToken,authenticationToken} = require('../middleware/authMiddleware')
const formatResponse = require('../common/ResponseFormat');

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

// Đăng ký người dùng và tạo token JWT
const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(formatResponse(null, false, 'Email đã được sử dụng.'));
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo một người dùng mới
        const newUser = await User.create({ email, username, password: hashedPassword });

        // Tạo token JWT cho người dùng mới đăng ký
        const { refreshToken, accessToken } = generateToken({ userId: newUser._id });

        res.status(200).json(formatResponse({ user: newUser, accessToken, refreshToken }, true, 'Đăng ký người dùng thành công.'));
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json(formatResponse(null, false, 'Đã xảy ra lỗi trong quá trình đăng ký người dùng.'));
    }
});

module.exports={loginUser}