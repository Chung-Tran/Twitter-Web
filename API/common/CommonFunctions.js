const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_CODE;

const generateRefreshToken = (user) => {
    const token = jwt.sign({ user:user._id,email:user.email }, secretKey, { expiresIn: '15d' });
    console.log(user)
    return token;
};

const generateAccessToken = (user) => {
    const token = jwt.sign({ user }, secretKey, { expiresIn: '15m' });
    return token;
};

module.exports = {
    generateRefreshToken,
    generateAccessToken
};
