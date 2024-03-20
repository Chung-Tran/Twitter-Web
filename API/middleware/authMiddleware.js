//Xử lí login, xác thực người dùng
const jwt = require('jsonwebtoken');
const secretKey=process.env.JWT_CODE;
const generateToken = (userInfo) => {
    const refeshToken = jwt.sign(userInfo, secretKey, { expiresIn: '7d' });
    const accessToken = jwt.sign(userInfo, secretKey, { expiresIn: '15m' });
    return { refeshToken, accessToken };
}


//Kiểm tra token hết hạn hay chưa, nếu hết hạn thì chuyển hướng qua login
const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}




