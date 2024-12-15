import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true,
});

export function handleAxiosError(error) {
  if (error.response) {
    if (error.response.status === 413) {
      return "File size is too large.";
    }
    return error.response.data.message || "An error occurred.";
  } else if (error.code === "ERR_NETWORK") {
    return "Network error. Please check your connection.";
  }
  return "An unexpected error occurred.";
}
