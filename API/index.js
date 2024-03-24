//Khởi tạo biến config
const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const dbConnect = require('./config/dbConnect');
const {connectRedis} = require('./config/redisConfig'); 
//Connect db
dbConnect();
//Define routes
const userRoute = require("./routes/UserRoute");
const sweetRoute = require('./routes/SweetRoute');
const commentRoute = require('./routes/CommentRoute');
const authenticationRoute = require("./routes/AuthenticationRoute");
const authenticateToken = require("./middleware/authMiddleware");

//Config server
app.use(cookieParser()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
//Connect redis server in docker
//  const redisClient = connectRedis();
// redisClient.connect();

//Middleware xác thực người dùng
app.use('/api/authentication', authenticationRoute);
app.use(authenticateToken);

//Use routes
app.use('/api/users', userRoute);
app.use('/api/sweet', sweetRoute);
app.use('/api/comment', commentRoute);

//Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server start in PORT ${PORT}`)
})


