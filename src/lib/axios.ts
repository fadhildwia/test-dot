import axios from "axios";  
  
const axiosInstance = axios.create({  
  baseURL: import.meta.env.VITE_BASEURL,  
});  
  
axiosInstance.interceptors.response.use(  
  (response) => {  
    return response;  
  },  
  (error) => {  
    console.error("API Error:", error);  
    return Promise.reject(error);  
  }  
);  
  
export default axiosInstance;  
