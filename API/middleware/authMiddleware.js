const jwt = require('jsonwebtoken');
const formatResponse = require('../common/ResponseFormat');
const User = require('../model/User');

const secretKey = process.env.JWT_CODE;


const authenticationToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json(formatResponse(null, false, "Không tồn tại token xác thực người dùng."));
    }
    try {
        const decodedToken = await jwt.verify(token, secretKey);
        req.user = decodedToken;    
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            try {
                const user = await User.findOne({ _id: decodedToken.userId });

                if (!user || !user.refreshToken) {
                    return res.status(401).json(formatResponse(null, false, "Xác thực người dùng thất bại. Không tìm thấy người dùng."));
                }

                const newAccessToken = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '15m' });
                const userResponse = {
                    userId: user._id,
                    email: user.email,

                }
                // Gửi access token mới trong header
                res.setHeader('Authorization', `Bearer ${newAccessToken}`);
                req.user = userResponse;
                next();
            } catch (error) {
                return res.status(403).json(formatResponse(null, false, "Refresh token is invalid"));
            }
        } else {
            return res.status(403).json(formatResponse(null, false, "Access token expire. Login again!!"));
        }
    }
}

module.exports = authenticationToken;
