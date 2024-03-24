//Controller xử lí người dùng đăng nhập, xác thực người dùng
const User = require('../model/User');
const crypto = require('crypto');
const asyncHandle = require('express-async-handler');
const { generateSessionToken, authenticationToken } = require('../middleware/authMiddleware')
const { generateRefreshToken } = require("../common/CommonFunctions");
const formatResponse = require('../common/ResponseFormat');
const { connectRedis } = require('../config/redisConfig');
const { sendEmail } = require('../config/sendMailConfig');
const jwt = require('jsonwebtoken');
const redisClient = connectRedis();
const secretKey = process.env.JWT_CODE;


const loginUser = asyncHandle(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
        res.status(403).json(formatResponse(null, false, "Không tìm thấy người dùng."));
    };
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const encodeData = {
            userId: findUser._id,
            email: findUser.email
        }
        const refeshToken = generateRefreshToken(encodeData);

        const updateUser = await User.findByIdAndUpdate(findUser._id, { refeshToken: refeshToken }, { new: true });
        // res.cookie("refeshToken", refeshToken, {
        //     httpOnly: true,
        //     maxAge: 72 * 60 * 60 * 1000,
        // });
        // res.cookie('refeshToken',generateRefeshToken)
        const responseData = {
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: refeshToken
        }
        res.status(200).json(formatResponse(responseData, true, "Đăng nhập thành công"));
    } else {
        res.status(403).json(formatResponse(null, false, "Mật khẩu không hợp lệ. Vui lòng thử lại."));
    }
});
const sendPasswordByEmail = asyncHandle(async (req, res) => {
    const { email } = req.body;
    console.log(email)
    const findUser = await User.findOne({ email });
    if (!findUser) {
        res.status(403).json(formatResponse(null, false, "Không tìm thấy người dùng."));
        return;
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetPasswordData = {
        userId: findUser._id,
        resetCode: resetCode
    };

    const success = await setKeyValue(`reset_password_code_${findUser._id}`, JSON.stringify(resetPasswordData));

    if (success) {
        console.log('Reset password code set successfully');
        const sendEmailPayload = {
            resetCode: resetCode,
            to: findUser.email
        };
        sendEmail(sendEmailPayload, (info) => {
            if (info && info.accepted.length > 0) {
                res.status(200).json(formatResponse(null, true, "Gửi mã OTP thành công."));
            } else {
                res.status(400).json(formatResponse(null, true, "Gửi mã OTP thất bại."));
            }
        });

    } else {
        console.error('Failed to set reset password code');
        res.status(500).json(formatResponse(null, false, "Đã xảy ra lỗi khi gửi mã đặt lại mật khẩu."));
    }
});

// API xác thực OTP
const authenticateOTP = asyncHandle(async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ email });

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(403).json(formatResponse(null, false, "Không tìm thấy người dùng."));
        }
        // Lấy giá trị reset code từ Redis
        const resetCodeData = await getKeyValue(`reset_password_code_${user._id}`);
        // Kiểm tra xem có tồn tại reset code trong Redis không
        if (!resetCodeData) {
            return res.status(403).json(formatResponse(null, false, "Mã OTP đã hết hạn. Vui lòng thử lại"));
        }
        const dataFromRedis = JSON.parse(resetCodeData);
        console.log("dataFromRedis,",dataFromRedis)
        if (dataFromRedis.resetCode != code)
            return res.status(400).json(formatResponse(null, false, "Mã OTP không hợp lệ. Vui lòng thử lại"));

        const tokenResetPassword = jwt.sign({ id: user._id, resetCode: code }, secretKey, { expiresIn: '3m' });
        await setKeyValue(`confirm_otp_${user._id}`, tokenResetPassword);

        // Trả về thành công nếu mã OTP hợp lệ
        return res.status(200).json(formatResponse({ token: tokenResetPassword }, true, "Xác thực OTP thành công."));

    } catch (error) {
        console.error("Error authenticating OTP:", error);
        return res.status(500).json(formatResponse(null, false, "Đã xảy ra lỗi khi xác thực OTP."));
    }
});

// API xác nhận đổi mật khẩu
const confirmResetPassword = asyncHandle(async (req, res) => {
    const { email, newPassword, token } = req.body;

    try {
        const user = await User.findOne({ email });
        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(400).json(formatResponse(null, false, "Phiên thay đổi mật khẩu hết hạn. Vui lòng thử lại"));
            } else {
                // Kiểm tra xem người dùng có tồn tại không
                if (!user) {
                    return res.status(403).json(formatResponse(null, false, "Không tìm thấy người dùng."));
                }
                //Lấy thông tin dưới cache
                const tokenConfirmPasswordFromRedis =await getKeyValue(`confirm_otp_${decoded.id}`);
                if (!tokenConfirmPasswordFromRedis) {
                    return res.status(400).json(formatResponse(null, false, "Mã OTP hết hạn. Vui lòng thử lại"));
                }

                const executeChangePassword = await jwt.verify(tokenConfirmPasswordFromRedis, secretKey, async (err, decoded) => {
                    if (err) {
                        return res.status(400).json(formatResponse(null, false, "Token gửi xác thực thay đổi mật khẩu không hợp lệ. Vui lòng thử lại"));
                    }
                    //Lấy lại mã OTP để xác thực một lần nữa
                    const resetCodeData = await getKeyValue(`reset_password_code_${user._id}`);

                    if (!resetCodeData) {
                        return res.status(400).json(formatResponse(null, false, "Phiên thay đổi mật khẩu hết hạn. Vui lòng thử lại"));
                    }
                    const dataFromRedis = JSON.parse(resetCodeData);

                    console.log("dataFromRedis",dataFromRedis)
                    console.log("decoded",decoded)
                    if (decoded.resetCode != dataFromRedis.resetCode) {
                        return res.status(400).json(formatResponse(null, false, "Cập nhật mật khẩu thất bại. Vui lòng thử lại"));
                    }
                })

                // Cập nhật mật khẩu của người dùng
                const updateResult = await user.updateUserPassword(newPassword);
                if (updateResult.isSuccess) {
                    // Xóa reset code từ Redis sau khi sử dụng
                    await redisClient.del(`reset_password_code_${user._id}`);

                    return res.status(200).json(formatResponse(null, true, "Cập nhật mật khẩu thành công."));
                }
                return res.status(400).json(formatResponse(null, false, "Cập nhật mật khẩu thất bại"));
            }
        });


    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json(formatResponse(null, false, "Đã xảy ra lỗi khi đặt lại mật khẩu."));
    }
});

const setKeyValue = async (key, value) => {
    try {
        // Đặt giá trị của key-value
        await redisClient.set(key, value);

        // Đặt thời gian sống cho key là 3 phút (180 giây)
        await redisClient.expire(key, 1000);

        console.log(`Key ${key} set successfully`);
        return true;
    } catch (error) {
        console.error(`Error setting key ${key}:`, error);
        return false;
    }
};
const getKeyValue = async (key) => {
    try {
        const result = await redisClient.get(key);
        console.log("r", result);
        return result;
    } catch (err) {
        console.log("Get key value failed. Err:", err);
        return false;
    }
}
module.exports = { loginUser, sendPasswordByEmail, authenticateOTP, confirmResetPassword }