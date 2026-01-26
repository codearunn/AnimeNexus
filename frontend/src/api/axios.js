import axios from "axios";

const api = axios.create({
  baseURL:"http://localhost:8000/api",
  withCredentials: true, // IMPORTANT for cookies
  headers:{
    "Content-type":"application/json", // It tells Express how to parse the request body.
  },
});

//“Before ANY request is sent, run this function.”
// Before login, register, getMe — ANY request:
// 	1.	Axios pauses
// 	2.	Looks for token in browser
// 	3.	If found → attaches it
// 	4.	Then sends request
api.interceptors.request.use(
  (config) =>{
    const token = localStorage.getItem("token");

    if(token){
      config.headers.Authorization= `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error) //“This request failed. Go to .catch().”
);

// “After ANY response comes back, run this.”
// If error:
// 	1.	Axios pauses
// 	2.	Checks status code
// 	3.	If 401 → user not logged in
// 	4.	Sends clean error to frontend
api.interceptors.response.use(
  (response) => response, //Just pass response normally.
  (error) =>{
    if(error.response){ // Backend DID respond. If false → internet down / server unreachable.
      const status = error.response.status;

      if(status === 401){
        console.log("Unauthorized");
      }
      if (status === 500) {
        console.log("Server error");
      }

      // A Promise has two paths:  ✅ resolve → success && ❌ reject → failure
      return Promise.reject(error.response.data); //“This request failed. Go to .catch().”
    }

    return Promise.reject({
      status:false,
      error:"Netwok error"
    })
  }
);

export default api;