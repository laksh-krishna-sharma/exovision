import axios from "axios";
import { toast } from "react-toastify";

// Create an Axios instance
const defaultBaseURL =
  typeof window !== "undefined" ? window.location.origin.replace(/\/$/, "") : "";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? defaultBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// Add a request interceptor to include Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);
  
// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information for debugging
    console.error("API Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
      }
    });

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      
      switch (status) {
        case 401:
          toast.error("Session expired. Please log in again.");
          // Optionally clear token and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          break;
        case 403:
          toast.error("You don't have permission to perform this action.");
          break;
        case 404:
          toast.error("The requested resource was not found.");
          break;
        case 500:
          toast.error("Internal server error. Please try again later.");
          break;
        case 502:
        case 503:
        case 504:
          toast.error("Server is temporarily unavailable. Please try again later.");
          break;
        default:
          if (error.response.data?.detail) {
            toast.error(error.response.data.detail);
          } else {
            toast.error(`Error: ${error.message}`);
          }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      toast.error("Network error. Please check your connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
      toast.error(`Error: ${error.message}`);
    }
    
    return Promise.reject(error);
  }
);

export default api;