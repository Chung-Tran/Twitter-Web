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



module.exports = { connectRedis };
