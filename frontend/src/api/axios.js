import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true, // IMPORTANT for cookies
  headers:{
    "Content-type":"application/json",
  },
});

api.interceptors.request.use(
  (config) =>{
    // #3 Auth is cookie-only (withCredentials: true above).
    // Removed: localStorage.getItem("token") + Authorization header \u2014 token is never stored in localStorage.
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) =>{
    if(error.response){
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      status:false,
      error:"Network error"
    })
  }
);


export default api;
