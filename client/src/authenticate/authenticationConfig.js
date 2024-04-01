import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5008/api',
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json'
      }
});

// Thêm interceptor để thiết lập token vào header của mỗi request
axiosClient.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token'); // Gọi hàm authorize để lấy token từ local storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    // (error) => {
    //     return Promise.reject(error);
    // }
);

// Thêm interceptor để cập nhật token trong local storage nếu nó được trả về từ phản hồi
axiosClient.interceptors.response.use(
    (response) => {
        const { data } = response;
        if (data && data?.data?.token) {
            localStorage.setItem('token', data.data.token); 
        }
        return response;
    },
    // (error) => {
    //     return Promise.reject(error);
    // }
);
export default axiosClient;
