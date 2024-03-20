const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const formatResponse = require("../common/ResponseFormat");
const { generateAccessToken, generateRefreshToken } = require("../common/CommonFunctions");


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Tên người dùng là duy nhất và không thể trống
    email: { type: String, required: true, unique: true }, // Email là duy nhất và không thể trống
    password: { type: String, required: true },
    displayName: { type: String, require: true },
    bio: { type: String },
    dob: { type: Date }, //date of birthday
    avatar: { type: String },
    followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }], // Mảng các ObjectId của người dùng theo dõi
    following: [{ type: mongoose.Types.ObjectId, ref: 'User' }], // Mảng các ObjectId của người dùng đang theo dõi
    isFanpage: { type: Boolean, default: false },
    refreshToken: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.refreshToken = generateRefreshToken(this);
    next();
});

userSchema.methods.isPasswordMatched = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};

userSchema.methods.checkAutoLogin = async function (accessToken) {
    try {
        // Giải mã access token
        const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_CODE);
        // Kiểm tra xem access token
        if (decodedAccessToken) {
            // Trả về true nếu access token hợp lệ
            return true;
        }
    } catch (error) {
        try {
            // Giải mã refresh token
            const decodedRefreshToken = jwt.verify(this.refreshToken, process.env.JWT_CODE)
            if (decodedRefreshToken) {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
};

userSchema.methods.generateNewAccessToken = async function (userInfo) {
    try {
        // Giải mã access token
        const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_CODE);
        // Kiểm tra xem access token
        if (decodedAccessToken) {
            // Trả về true nếu access token hợp lệ
            return formatResponse(decodedAccessToken, true, null);
        }
    } catch (error) {
        try {
            // Giải mã refresh token
            const decodedRefreshToken = jwt.verify(this.refreshToken, process.env.JWT_CODE);

            const newAccessToken = generateAccessToken(userInfo)
            if (decodedRefreshToken) {
                return formatResponse(newAccessToken, true, null);
            }
        } catch (error) {
            return formatResponse(null, false, "Refresh token is invalid");
        }
    }
}

module.exports = mongoose.model('User', userSchema)