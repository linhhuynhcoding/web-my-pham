/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "@/config";
import axios from "axios";

  const baseUrl = envConfig.VITE_API_BASE_URL;


const apiClient = axios.create({
  /**
   * The base URL for all API requests.
   * It's configured to use an environment variable for flexibility between
   * development and production, with a fallback for local development.
   */
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token in every request.
apiClient.interceptors.request.use(
  (config : any) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error : any) => Promise.reject(error)
);

export default apiClient;
