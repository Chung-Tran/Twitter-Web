//Khởi tạo biến config
const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const dbConnect = require('./config/dbConnect');
const { connectRedis, addUserOnlineToList } = require('./config/redisConfig'); 
const cloudinary = require('cloudinary').v2;
const { sendMessage } = require("./controllers/MessageController")
const {wss,userConnection} = require('./config/webSocketConfig');


cloudinary.config({
    secure: true
});
// const wss = new WebSocket.Server({ port: 8080 });//Config khởi tạo server websocket cho chức năng chat

//Config firebase
// firebase.auth().languageCode = 'it';
//Connect db
dbConnect();
//Connect redis server in docker
// const redisClient = connectRedis();
// redisClient.connect();
//config websocket
wss.on('connection', function connection(ws) {
    userConnection.add(ws);
    // Xử lý các tin nhắn nhận được từ client
    ws.on('message', function incoming(message) {
        try {
            console.log('receive')
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === 'chat') {
                // Tin nhắn là loại chat, gọi hàm sendMessage để xử lý
                sendMessage(parsedMessage,userConnection);
            }
            
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    // Xử lý sự kiện đóng kết nối từ client
    // ws.on('close', function close() {
    //     console.log('Client disconnected');
        // Xóa thông tin của client khỏi Redis
    //     redisClient.srem("online-users", ws, (err, reply) => {
    //         if (err) {
    //             console.error('Error removing user from online list:', err);
    //         } else {
    //             console.log('User removed from online list:', ws);
    //         }
    //     });
    //  });
});

//Define routes
const userRoute = require("./routes/UserRoute");
const sweetRoute = require('./routes/SweetRoute');
const commentRoute = require('./routes/CommentRoute');
const authenticationRoute = require("./routes/AuthenticationRoute");
 const authenticateToken = require("./middleware/authMiddleware");
const shareRoute = require("./routes/ShareRoute");
const messageRoute = require("./routes/MessageRoute");
const authenticationToken = require("./middleware/authMiddleware");


//Config server
app.use(cookieParser()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

//Middleware xác thực người dùng
app.use('/api/authentication', authenticationRoute);

  app.use(authenticationToken);

//Use routes
app.use('/api/users', userRoute);
app.use('/api/sweet', sweetRoute);
app.use('/api/comment', commentRoute);
app.use('/api/share', shareRoute);
app.use('/api/share', shareRoute);
app.use('/api/chat', messageRoute);

//Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server start in PORT ${PORT}`)
})


