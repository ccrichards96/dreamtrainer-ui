import axios, { AxiosInstance } from "axios";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api/v1";

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Re-export types from the centralized types file
export type { APIResponse, ApiError } from "../../types/api";

export default apiClient;
