import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    timeout: 10000,
});


//Request Interceptor

axiosInstance.interceptors.request.use (
    (config) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
   (error) => {
               
        // Error from error handler middleware
        let serverMessage = error.response?.data?.msg || error.response?.data?.message;

        //Fall back ONLY if network failed or server dropped connection before responding  
        if (!serverMessage) {
            serverMessage = error.request 
                ? 'Network Error: Cannot connect to server' 
                : error.message;
        }

        // Handle global auth redirection for 401s
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Attach the exact backend error message to the error object
        error.backendMessage = serverMessage;

        return Promise.reject(error);
    }
);

export default axiosInstance;
