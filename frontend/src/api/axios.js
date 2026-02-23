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
    const token = localStorage.getItem("token");

    if(token){
      config.headers.Authorization= `Bearer ${token}`;
    }

    // Log request for debugging
    console.log("API Request:", config.method?.toUpperCase(), config.url, "withCredentials:", config.withCredentials);

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) =>{
    if(error.response){
      const status = error.response.status;

      console.log("API Error:", status, error.response.data);

      if(status === 401){
        console.log("Unauthorized - Please login");
      }
      if (status === 500) {
        console.log("Server error");
      }

      return Promise.reject(error.response.data);
    }

    console.error("Network error:", error.message);
    return Promise.reject({
      status:false,
      error:"Network error"
    })
  }
);

export default api;
