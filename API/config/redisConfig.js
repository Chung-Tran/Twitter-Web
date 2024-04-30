// redisConfig.js
const redis = require("redis");

let redisClient;

const connectRedis = () => {
    if (!redisClient) {
        redisClient = redis.createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT 
        });

        redisClient.on('error', function (err) {
            console.log('Error ' + err);
        });

        redisClient.on('connect', function() {
            console.log('Connected to Redis successfully'); // Hiển thị thông báo khi kết nối thành công
        });
        redisClient.on('end', function() {
            console.log('Connection to Redis has been closed'); // Hiển thị thông báo khi kết nối đã đóng
        });
    }
    return redisClient;
}
const addUserOnlineToList = async (ws) => {
    // Thêm thông tin của client vào redis
    redisClient.sadd("online-users", ws, (err, reply) => {
        if (err) {
            console.error('Error adding user to online list:', err);
        } else {
            console.log('User added to online list:', ws);
        }
    });
}



module.exports = { connectRedis,addUserOnlineToList };
